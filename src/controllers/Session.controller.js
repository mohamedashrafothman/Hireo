import Controller from "../utilities/Controller";

import SessionService from "../services/Session";

class SessionController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new SessionController(SessionService);
