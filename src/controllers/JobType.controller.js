import Controller from "../utilities/Controller";
import JobTypeService from "../services/JobTypeService";

class JobTypeController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new JobTypeController(JobTypeService);
