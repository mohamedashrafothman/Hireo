import Service from "../utilities/Service";
import Message from "../models/Message.model";

class MessageService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new MessageService(Message);
