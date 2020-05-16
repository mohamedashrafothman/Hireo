import Controller from "../utilities/Controller";

import Session from "../models/Session.model";
import SessionService from "../services/Session";

const sessionService = new SessionService(Session);

class SessionController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new SessionController(sessionService);
