import { isEmpty } from "lodash";
import Controller from "../utilities/Controller";

import ConversationService from "../services/Conversation";
import Conversation from "../models/Conversation.model";

const conversationService = new ConversationService(Conversation);

class ConversationController extends Controller {
	constructor(service) {
		super(service);
	}

	async getAllConversations(req, res, next) {
		const { id, status = 0 } = req.params;
		const options = {
			populate: [
				{ path: "users", select: "is_active email account", populate: "account.picture account.picture_sm account.picture_md account.picture_lg" },
				{ path: "messages", options: { sort: { created_at: "desc" } }, populate: { path: "user", populate: "account.picture account.picture_sm account.picture_md account.picture_lg" } }
			],
			sort: { updated_at: "desc" },
			pagination: false
		};
		const conversationQuery = { ...(id && { _id: id }), ...(req.user.role !== "admin" && { users: req.user._id }), ...(!id && { status }) };
		const conversationsQuery = { ...(req.user.role !== "admin" && { users: req.user._id }), status };

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
			}
		});
	}

	async changeConversationStatus(req, res, next) {
		const { status, conversation } = req.params;
		const query = { _id: conversation, users: req.user._id };

		// check if conversation found.
		const conversationReadResponse = await conversationService.readOne(query);
		if (conversationReadResponse.error) return next(conversationReadResponse.errors);
		if (isEmpty(conversationReadResponse.data)) return next();

		// update conversation status.
		const conversationUpdateResponse = await conversationService.updateOne(query, { $set: { status } });
		if (conversationUpdateResponse.error) return next(conversationUpdateResponse.errors);

		res.status(conversationUpdateResponse.statusCode).redirect("/dashboard/conversations");
	}
}

export default new ConversationController(conversationService);
