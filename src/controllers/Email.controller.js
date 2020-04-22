import Controller from "../utilities/Controller";
import Email from "../models/Email.model";
import EmailService from "../services/Email";

const emailService = new EmailService(Email);

class EmailController extends Controller {
    constructor(service) {
        super(service);
    }
}

export default new EmailController(emailService);