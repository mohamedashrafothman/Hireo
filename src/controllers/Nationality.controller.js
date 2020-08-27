import Controller from "../utilities/Controller";
import NationalityService from "../services/Nationality";

class NationalityController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new NationalityController(NationalityService);
