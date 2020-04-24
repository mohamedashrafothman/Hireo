import { blue, red } from "chalk";

export default class SocketConnection {
	constructor(io) {
		this.io = io;
		this.connectedUsers = {};
		this.init();
	}

	init() {
		this.io.sockets.on("connection", this.connectingEvent.bind(this));
	}

	connectingEvent(socket) {
		console.log(`✅  ${blue("Socket connection has been opened successfully!")}`);

		// Add socket to all class for all methods accessability.
		this.socket = socket;
		// Add loged in user id to connected users with it's socket obkect.
		this.connectedUsers[this.socket.request.session.passport.user] = this.socket;

		// Socket Event handlers.
		this.socket.on("newMessage", this.newMessageEvent.bind(this));
		this.socket.on("disconnect", this.disconnectingEvent.bind(this));
	}

	disconnectingEvent() {
		if (this.connectedUsers[this.socket.request.session.passport.user]) {
			delete this.connectedUsers[this.socket.request.session.passport.user];
		}
		console.log(`✅  ${red("Socket connection has been disconnected successfully!")}`);
	}

	async newMessageEvent(data) {
		if (this.connectedUsers[data.to]) {
			this.connectedUsers[data.to].emit("message", data);
		}
	}
}
