import Controller from "../utilities/Controller";
import JobType from "../models/Job_type.model";
import JobTypeService from "../services/JobTypeService";

const jobTypeService = new JobTypeService(JobType);

class JobTypeController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new JobTypeController(jobTypeService);
