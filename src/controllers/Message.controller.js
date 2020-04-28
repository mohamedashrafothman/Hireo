import { body, validationResult, sanitizeBody } from "express-validator";
import { isEmpty } from "lodash";
import Controller from "../utilities/Controller";
import MessageService from "../services/Message";
import ConversationService from "../services/Conversation";
import Message from "../models/Message.model";
import Conversation from "../models/Conversation.model";

const messageService = new MessageService(Message);
const conversationService = new ConversationService(Conversation);

class MessageController extends Controller {
	constructor(service) {
		super(service);
	}

	validator(method) {
		switch (method) {
		case "add message":
			return [
				sanitizeBody("content"),
				body("content").notEmpty().withMessage("Message Can't be Empty!").trim(),
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

		// TODO: Emit to new message socket event.

		const { to } = req.params;

		const conversationReadResponse = await conversationService.readOne({ users: { $size: 2, $all: [req.user._id, to] } });
		if (conversationReadResponse.error) return next(conversationReadResponse.errors);

		if (!isEmpty(conversationReadResponse.data)) {
			req.body = { user: req.user._id, conversation: conversationReadResponse.data._id, ...req.body };

			const messageCreateResponse = await messageService.create(req.body);
			if (messageCreateResponse.error) return next(messageCreateResponse.errors);

			const conversationUpdateResponse = await conversationService.updateOne(
				{ _id: conversationReadResponse.data._id },
				{ $addToSet: { messages: messageCreateResponse.data._id } }
			);
			if (conversationUpdateResponse.error) return next(conversationUpdateResponse.errors);


			req.flash("success", "Direct Message Sent Successfully");
			return res.redirect("back");
		}

		const conversationCreateResponse = await conversationService.create({ users: [req.user._id, to] });
		if (conversationCreateResponse.error) return next(conversationCreateResponse.errors);

		req.body = { user: req.user._id, conversation: conversationCreateResponse.data._id, ...req.body };

		const messageCreateResponse = await messageService.create(req.body);
		if (messageCreateResponse.error) return next(messageCreateResponse.errors);

		const conversationUpdateResponse = await conversationService.updateOne(
			{ _id: conversationCreateResponse.data._id },
			{ $addToSet: { messages: messageCreateResponse.data._id } }
		);
		if (conversationUpdateResponse.error) return next(conversationUpdateResponse.errors);

		req.flash("success", "Direct Message Sent Successfully");
		res.redirect("back");
	}
}

export default new MessageController(messageService);
