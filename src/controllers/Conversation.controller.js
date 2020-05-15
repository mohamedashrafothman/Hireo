import { isEmpty } from "lodash";
import Controller from "../utilities/Controller";

import Message from "../models/Message.model";
import Conversation from "../models/Conversation.model";

import MessageService from "../services/Message";
import ConversationService from "../services/Conversation";

const messageService = new MessageService(Message);
const conversationService = new ConversationService(Conversation);

class ConversationController extends Controller {
	constructor(service) {
		super(service);
	}

	async getAllConversations(req, res, next) {
		const { id } = req.params;
		const options = {
			populate: [
				{
					path: "users",
					select: "is_active email account",
					populate: "account.picture account.picture_sm account.picture_md account.picture_lg"
				},
				{
					path: "messages",
					match: { is_deleted: false },
					options: { sort: { created_at: "desc" } },
					populate: {
						path: "user",
						populate: "account.picture account.picture_sm account.picture_md account.picture_lg"
					}
				}
			],
			sort: { updated_at: "desc" }
		};
		const conversationQuery = {
			...(id && { _id: id }),
			...(req.user.role !== "admin" && { users: req.user._id }),
			...(!id && { is_deleted: false, deleted_by: { $ne: req.user._id } })
		};
		const conversationsQuery = {
			...(req.user.role !== "admin" && { users: req.user._id }),
			is_deleted: false,
			deleted_by: { $ne: req.user._id }
		};

		const conversationReadResponse = await conversationService.readMany(conversationQuery, options);
		if (conversationReadResponse.error) return next(conversationReadResponse.errors);

		const conversationsReadResponse = await conversationService.readMany(conversationsQuery, options);
		if (conversationsReadResponse.error) return next(conversationsReadResponse.errors);

		res.render("dashboard/messages", {
			page_title: "Messages",
			...conversationsReadResponse,
			data: {
				conversations: conversationsReadResponse.data,
				conversation: conversationReadResponse.data[0]
			},
			query: req.query
		});
	}

	async deleteConversation(req, res, next) {
		const { conversation } = req.params;
		const query = { _id: conversation, users: req.user._id };

		// Check if conversation found.
		const conversationReadResponse = await conversationService.readOne(query);
		if (conversationReadResponse.error) return next(conversationReadResponse.errors);
		if (isEmpty(conversationReadResponse.data)) return next();

		// Update conversation status.
		const conversationUpdateResponse = await conversationService.updateOne(
			query,
			{
				...(conversationReadResponse.data.deleted_by.length >= 1 && { $set: { is_deleted: true } }),
				...(conversationReadResponse.data.deleted_by.length <= 1 && { $addToSet: { deleted_by: req.user._id } })
			}
		);
		if (conversationUpdateResponse.error) return next(conversationUpdateResponse.errors);

		// Update all messages belongs to the deleted conversation.
		const messagesUpdateResponse = await messageService.updateMany(
			{ conversation: conversationReadResponse.data._id, created_at: { $lt: new Date() } },
			{ ...(conversationReadResponse.data.deleted_by.length >= 1 && { $set: { is_deleted: true } }) }
		);
		if (messagesUpdateResponse.error) return next(messagesUpdateResponse.errors);

		res.status(conversationUpdateResponse.statusCode).redirect("/dashboard/conversations");
	}
}

export default new ConversationController(conversationService);
