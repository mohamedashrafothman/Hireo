import Service from "../utilities/Service";
import Session from "../models/Session.model";

class SessionService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new SessionService(Session);
