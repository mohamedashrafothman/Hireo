import { CronJob } from "cron";

import Job from "../models/Job.model";
import JobService from "../services/Job";

const jobService = new JobService(Job);

export default class CronJobs {
	constructor() {
		this.makeJobsExpire();
	}

	makeJobsExpire() {
		new CronJob("00 * * * * *", async () => {
			const jobExpiringResponse = await jobService.updateMany(
				{ status: 1, expiring_at: { $gte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), $lt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) } },
				{ $set: { status: 3 } }
			);
			if (jobExpiringResponse.error) throw jobExpiringResponse.errors;

			const jobExpiredResponse = await jobService.updateMany(
				{ status: 3, expiring_at: { $gte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), $lt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000) } },
				{ $set: { status: 4 } }
			);
			if (jobExpiredResponse.error) throw jobExpiredResponse.errors;
		}, null, true, "Africa/Cairo");
	}
}
