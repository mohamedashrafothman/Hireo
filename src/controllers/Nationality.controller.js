import Controller from "../utilities/Controller";
import Nationality from "../models/Nationality.model";
import NationalityService from "../services/Nationality";

const nationalityService = new NationalityService(Nationality);

class NationalityController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new NationalityController(nationalityService);
