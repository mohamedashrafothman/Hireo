/* eslint-disable import/no-cycle */
import { isEmpty } from "lodash";
import to from "await-to-js";
import Service from "../utilities/Service";
import Application from "../models/Application.model";

import JobService from "./Job";

class ApplicationService extends Service {
	constructor(model) {
		super(model);
		this.isAppliedBefore = this.isAppliedBefore.bind(this);
		this.unSeenApplicationsByUser = this.unSeenApplicationsByUser.bind(this);
	}

	async isAppliedBefore(job_id, created_by_id) {
		const [applicationErrors, application] = await to(
			this.model.findOne({ job: job_id, created_by: created_by_id })
		);
		if (applicationErrors) return { error: true, statusCode: 500, errors: applicationErrors };
		if (!isEmpty(application)) {
			return { error: false, statusCode: 409, data: { isAppliedBefore: true } };
		}
		return { error: false, statusCode: 200, data: { isAppliedBefore: false } };
	}

	async unSeenApplicationsByUser(user) {
		const jobReadResponse = await JobService.readMany(
			{
				...(user && user.role !== "admin" && { created_by: user._id }),
			},
			{ pagination: false }
		);
		if (jobReadResponse.error) return jobReadResponse;

		const unSeenApplicationsResponse = await this.readMany(
			{ job: { $in: jobReadResponse.data.map((current) => current._id) }, was_seen: false },
			{ select: "_id", pagination: false }
		);
		return unSeenApplicationsResponse;
	}
}

export default new ApplicationService(Application);
