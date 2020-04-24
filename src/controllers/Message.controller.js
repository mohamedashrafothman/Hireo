import Controller from "../utilities/Controller";
import MessageService from "../services/Message";
import Message from "../models/Message.model";

const messageService = new MessageService(Message);

class MessageController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new MessageController(messageService);
