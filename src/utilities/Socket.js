import { blue, red } from "chalk";

import User from "../models/User.model";
// import Message from "../models/Message.model";
// import Conversation from "../models/Conversation.model";

import UserService from "../services/User";
// import MessageService from "../services/Message";
// import ConversationService from "../services/Conversation";

const userService = new UserService(User);
// const messageService = new MessageService(Message);
// const conversationService = new ConversationService(Conversation);

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

	disconnectingEvent() {
		console.log(`✅  ${red("Socket connection has been disconnected successfully!")}`);
	}

	joinChatEvent(conversation) {
		this.socket.join(conversation);
	}

	async newMessageEvent(data, cb) {
		const userReadResponse = await userService.readMany(
			{ _id: { $in: [data.to, data.from] } },
			{
				pagination: false,
				select: "email account is_active",
				populate: [
					{ path: "account.picture", select: "path name" },
					{ path: "account.picture_sm", select: "path name" },
					{ path: "account.picture_md", select: "path name" },
					{ path: "account.picture_lg", select: "path name" }
				]
			}
		);
		if (userReadResponse.error) return cb(userReadResponse.errors);

		[data.to, data.from] = [userReadResponse.data.filter((current) => String(current._id) === data.to)[0], userReadResponse.data.filter((current) => String(current._id) === data.from)[0]];

		this.io.sockets.in(data.conversation).emit("message", data);
	}

	async userTypingEvent(data, cb) {
		const userReadResponse = await userService.readMany(
			{ _id: { $in: [data.to, data.from] } },
			{
				pagination: false,
				select: "email account is_active",
				populate: [
					{ path: "account.picture", select: "path name" },
					{ path: "account.picture_sm", select: "path name" },
					{ path: "account.picture_md", select: "path name" },
					{ path: "account.picture_lg", select: "path name" }
				]
			}
		);
		if (userReadResponse.error) return cb(userReadResponse.errors);

		[data.to, data.from] = [userReadResponse.data.filter((current) => String(current._id) === data.to)[0], userReadResponse.data.filter((current) => String(current._id) === data.from)[0]];

		this.io.sockets.in(data.conversation).emit("typing", data);
	}
}
