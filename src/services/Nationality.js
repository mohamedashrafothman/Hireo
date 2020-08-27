import Service from "../utilities/Service";
import Nationality from "../models/Nationality.model";

class NationalityService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new NationalityService(Nationality);
