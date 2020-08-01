import { body, validationResult } from "express-validator";
import { isEmpty } from "lodash";
import Controller from "../utilities/Controller";

import UserService from "../services/User";
import MessageService from "../services/Message";
import ConversationService from "../services/Conversation";

import User from "../models/User.model";
import Message from "../models/Message.model";
import Conversation from "../models/Conversation.model";

const userService = new UserService(User);
const messageService = new MessageService(Message);
const conversationService = new ConversationService(Conversation);

class MessageController extends Controller {
	constructor(service) {
		super(service);
		this.addMessage = this.addMessage.bind(this);
		this.readAllMessages = this.readAllMessages.bind(this);
	}

	validator(method) {
		switch (method) {
		case "add message":
			return [
				body("content")
					.notEmpty()
					.withMessage("Message Can't be Empty!")
					.trim()
					.escape(),
			];
		default:
			return [];
		}
	}

	async addMessage(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.redirect("back");
		}

		const { to } = req.params;
		const { io } = req.app.get("io");

		const conversationReadResponse = await conversationService.readOne({
			users: { $size: 2, $all: [req.user._id, to] },
		});
		if (conversationReadResponse.error) { return next(conversationReadResponse.errors); }

		if (!isEmpty(conversationReadResponse.data)) {
			req.body = {
				user: req.user._id,
				conversation: conversationReadResponse.data._id,
				...req.body,
			};

			const messageCreateResponse = await this.service.create(req.body);
			if (messageCreateResponse.error) { return next(messageCreateResponse.errors); }

			const conversationUpdateResponse = await conversationService.updateOne(
				{ _id: conversationReadResponse.data._id },
				{
					$addToSet: { messages: messageCreateResponse.data._id },
					$set: { is_deleted: false },
					$pull: { deleted_by: to },
				}
			);
			if (conversationUpdateResponse.error) { return next(conversationUpdateResponse.errors); }

			// Getting all users in the conversation.
			const userReadResponse = await userService.readMany(
				{ _id: { $in: conversationReadResponse.data.users } },
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

			// sending created message using sockets to all users in the conversation.
			io.sockets.in(conversationReadResponse.data._id).emit("message", {
				to: userReadResponse.data.filter(
					(current) => String(current._id) === String(to)
				)[0],
				to_gravatar: userReadResponse.data
					.filter((current) => String(current._id) === String(to))[0]
					.gravatar(50),
				from: userReadResponse.data.filter(
					(current) => String(current._id) === String(req.user._id)
				)[0],
				from_gravatar: userReadResponse.data
					.filter(
						(current) => String(current._id) === String(req.user._id)
					)[0]
					.gravatar(50),
				message: messageCreateResponse.data,
			});

			req.flash("success", "Direct Message Sent Successfully");
			return res
				.status(messageCreateResponse.statusCode)
				.redirect("back");
		}

		const conversationCreateResponse = await conversationService.create({
			users: [req.user._id, to],
		});
		if (conversationCreateResponse.error) { return next(conversationCreateResponse.errors); }

		req.body = {
			user: req.user._id,
			conversation: conversationCreateResponse.data._id,
			...req.body,
		};

		const messageCreateResponse = await this.service.create(req.body);
		if (messageCreateResponse.error) { return next(messageCreateResponse.errors); }

		const conversationUpdateResponse = await conversationService.updateOne(
			{ _id: conversationCreateResponse.data._id },
			{
				$addToSet: { messages: messageCreateResponse.data._id },
				$set: { is_deleted: false },
				$pull: { deleted_by: to },
			}
		);
		if (conversationUpdateResponse.error) { return next(conversationUpdateResponse.errors); }

		// Getting all users in the conversation.
		const userReadResponse = await userService.readMany(
			{ _id: { $in: conversationCreateResponse.data.users } },
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

		// sending created message using sockets to all users in the conversation.
		io.sockets.in(conversationCreateResponse.data._id).emit("message", {
			to: userReadResponse.data.filter(
				(current) => String(current._id) === String(to)
			)[0],
			to_gravatar: userReadResponse.data
				.filter((current) => String(current._id) === String(to))[0]
				.gravatar(50),
			from: userReadResponse.data.filter(
				(current) => String(current._id) === String(req.user._id)
			)[0],
			from_gravatar: userReadResponse.data
				.filter(
					(current) => String(current._id) === String(req.user._id)
				)[0]
				.gravatar(50),
			message: messageCreateResponse.data,
		});

		req.flash("success", "Direct Message Sent Successfully");
		res.status(messageCreateResponse.statusCode).redirect("back");
	}

	async readAllMessages(req, res, next) {
		const { messages } = req.body;

		const messagesUpdateResponse = await this.service.updateMany(
			{ _id: { $in: messages } },
			{ $set: { was_read: true } }
		);
		if (messagesUpdateResponse.error) { return next(messagesUpdateResponse.errors); }

		const messagesReadResponse = await this.service.readMany(
			{ _id: { $in: messages } },
			{ pagination: false, select: "_id was_read" }
		);
		if (messagesReadResponse.error) { return next(messagesReadResponse.errors); }

		return res.json(messagesReadResponse.data);
	}
}

export default new MessageController(messageService);
