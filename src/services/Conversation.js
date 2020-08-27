import Service from "../utilities/Service";
import Conversation from "../models/Conversation.model";

class ConversationService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new ConversationService(Conversation);
