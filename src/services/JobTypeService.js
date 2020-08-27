import Service from "../utilities/Service";
import JobType from "../models/Job_type.model";

class JobTypeService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new JobTypeService(JobType);
