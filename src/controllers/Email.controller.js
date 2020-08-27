import Controller from "../utilities/Controller";
import EmailService from "../services/Email";

class EmailController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new EmailController(EmailService);
