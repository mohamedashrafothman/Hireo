import { blue, red } from "chalk";

import UserService from "../services/User";
import MessageService from "../services/Message";
import ConversationService from "../services/Conversation";

export default class SocketConnection {
	constructor(io) {
		this.io = io;

		this.connectionEvent = this.connectionEvent.bind(this);
		this.joinChatEvent = this.joinChatEvent.bind(this);
		this.newMessageEvent = this.newMessageEvent.bind(this);
		this.userTypingEvent = this.userTypingEvent.bind(this);
		this.disconnectingEvent = this.disconnectingEvent.bind(this);

		this.connectionEvent();
	}

	async connectionEvent() {
		await this.io.sockets.on("connection", (socket) => {
			console.log(`✅  ${blue("Socket connection has been opened!")}`);

			// Save socket.io in the session
			socket.request.session.socketio = socket.id;
			socket.request.session.save();

			// Add socket to all class for all methods accessability.
			this.socket = socket;
			this.session = socket.request.session;

			// Socket Event handlers.
			this.socket.on("conversations/join", (conversation) => this.joinChatEvent(conversation));
			this.socket.on("messages/new", (data) => this.newMessageEvent(data));
			this.socket.on("messages/typing", (data) => this.userTypingEvent(data));
			this.socket.on("messages/read_all", (data) => this.readAllMessages(data));
			this.socket.on("disconnect", () => this.disconnectingEvent());
		});
	}

	async disconnectingEvent() {
		console.log(`✅  ${red("Socket connection has been closed!")}`);
	}

	async joinChatEvent(conversation) {
		await this.socket.join(conversation);
	}

	async newMessageEvent(data) {
		// get user documents from mongodb.
		const userReadResponse = await UserService.readMany(
			{ _id: { $in: [data.to, data.from] } },
			{
				pagination: false,
				select: "email slug account is_active",
				populate: [
					{ path: "account.picture", select: "path name" },
					{ path: "account.picture_sm", select: "path name" },
					{ path: "account.picture_md", select: "path name" },
					{ path: "account.picture_lg", select: "path name" },
				],
			}
		);
		if (userReadResponse.error) throw userReadResponse.errors;

		// create new messages documents in mongodb.
		const messageCreateResponse = await MessageService.create({
			user: data.from,
			conversation: data.conversation,
			content: data.message,
		});
		if (messageCreateResponse.error) throw messageCreateResponse.errors;

		// add messages to conversation model.
		const conversationUpdateResponse = await ConversationService.updateOne(
			{ _id: data.conversation },
			{
				$addToSet: { messages: messageCreateResponse.data._id },
				$set: { is_deleted: false },
				$pull: { deleted_by: data.to },
			}
		);
		if (conversationUpdateResponse.error) throw conversationUpdateResponse.errors;

		// add user documents to event data.
		[data.to, data.to_gravatar, data.from, data.from_gravatar, data.message] = [
			userReadResponse.data.filter((current) => String(current._id) === data.to)[0],
			userReadResponse.data.filter((current) => String(current._id) === data.to)[0].gravatar(50),
			userReadResponse.data.filter((current) => String(current._id) === data.from)[0],
			userReadResponse.data.filter((current) => String(current._id) === data.from)[0].gravatar(50),
			messageCreateResponse.data,
		];

		// Emitting new message to all users in conversation.
		this.io.sockets.in(data.conversation).emit("message", data);
	}

	async userTypingEvent(data) {
		// get user documents from mongodb.
		const userReadResponse = await UserService.readMany(
			{ _id: { $in: [data.to, data.from] } },
			{
				pagination: false,
				select: "email account is_active",
				populate: [
					{ path: "account.picture", select: "path name" },
					{ path: "account.picture_sm", select: "path name" },
					{ path: "account.picture_md", select: "path name" },
					{ path: "account.picture_lg", select: "path name" },
				],
			}
		);
		if (userReadResponse.error) throw userReadResponse.errors;

		// add user documents to event data.
		[data.to, data.from] = [
			userReadResponse.data.filter((current) => String(current._id) === data.to)[0],
			userReadResponse.data.filter((current) => String(current._id) === data.from)[0],
		];

		// Emitting new message to all users in conversation.
		this.io.sockets.in(data.conversation).emit("typing", data);
	}

	async readAllMessages(data) {
		const messagesReadResponse = await MessageService.readMany({
			conversation: data.conversation,
			user: data.receiver,
			was_read: false,
		});
		if (messagesReadResponse.error) throw messagesReadResponse.errors;

		const messagesUpdateResponse = await MessageService.updateMany(
			{ conversation: data.conversation, user: data.receiver, was_read: false },
			{ $set: { was_read: true } }
		);
		if (messagesUpdateResponse.error) throw messagesUpdateResponse.errors;

		// Emit to sender only.
		this.io.sockets
			.in(data.conversation)
			.emit("all_messages_readed", { ...data, messages: messagesReadResponse.data });
	}
}
