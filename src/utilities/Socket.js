import { blue, red } from "chalk";

import User from "../models/User.model";
import Message from "../models/Message.model";
import Conversation from "../models/Conversation.model";

import UserService from "../services/User";
import MessageService from "../services/Message";
import ConversationService from "../services/Conversation";

const userService = new UserService(User);
const messageService = new MessageService(Message);
const conversationService = new ConversationService(Conversation);

export default class SocketConnection {
	constructor(io) {
		this.io = io;
		this.init();
	}

	init() {
		this.io.sockets.on("connection", this.connectingEvent.bind(this));
	}

	connectingEvent(socket) {
		console.log(`✅  ${blue("Socket connection has been opened successfully!")}`);

		// Add socket to all class for all methods accessability.
		this.socket = socket;

		// Socket Event handlers.
		this.socket.on("join_conversation", this.joinChatEvent.bind(this));
		this.socket.on("new_message", this.newMessageEvent.bind(this));
		this.socket.on("user_is_typing", this.userTypingEvent.bind(this));
		this.socket.on("disconnect", this.disconnectingEvent.bind(this));
	}

	disconnectingEvent() { console.log(`✅  ${red("Socket connection has been disconnected successfully!")}`); }

	joinChatEvent(conversation) { this.socket.join(conversation); }

	async newMessageEvent(data) {
		// get user documents from mongodb.
		const userReadResponse = await userService.readMany(
			{ _id: { $in: [data.to, data.from] } },
			{ pagination: false, select: "email slug account is_active", populate: [{ path: "account.picture", select: "path name" }, { path: "account.picture_sm", select: "path name" }, { path: "account.picture_md", select: "path name" }, { path: "account.picture_lg", select: "path name" }] }
		);
		if (userReadResponse.error) throw userReadResponse.errors;

		// create new messages documents in mongodb.
		const messageCreateResonse = await messageService.create({ user: data.from, conversation: data.conversation, content: data.message });
		if (messageCreateResonse.error) throw messageCreateResonse.errors;

		// add messages to conversation model.
		const conversationUpdateResponse = await conversationService.updateOne({ _id: data.conversation }, { $addToSet: { messages: messageCreateResonse.data._id } });
		if (conversationUpdateResponse.error) throw conversationUpdateResponse.errors;

		// add user documents to event data.
		[data.to, data.from, data.message] = [
			userReadResponse.data.filter((current) => String(current._id) === data.to)[0],
			userReadResponse.data.filter((current) => String(current._id) === data.from)[0],
			messageCreateResonse.data
		];

		// Emitting new message to all users in conversation.
		this.io.sockets.in(data.conversation).emit("message", data);
	}

	async userTypingEvent(data) {
		// get user documents from mongodb.
		const userReadResponse = await userService.readMany(
			{ _id: { $in: [data.to, data.from] } },
			{ pagination: false, select: "email account is_active", populate: [{ path: "account.picture", select: "path name" }, { path: "account.picture_sm", select: "path name" }, { path: "account.picture_md", select: "path name" }, { path: "account.picture_lg", select: "path name" }] }
		);
		if (userReadResponse.error) throw userReadResponse.errors;

		// add user documents to event data.
		[data.to, data.from] = [userReadResponse.data.filter((current) => String(current._id) === data.to)[0], userReadResponse.data.filter((current) => String(current._id) === data.from)[0]];

		// Emitting new message to all users in conversation.
		this.io.sockets.in(data.conversation).emit("typing", data);
	}
}
