import { isEmpty } from "lodash";
import to from "await-to-js";
import Service from "../utilities/Service";
import Job from "../models/Job.model";

class JobService extends Service {
	constructor(model) {
		super(model);
		this.getTags = this.getTags.bind(this);
		this.getMinMax = this.getMinMax.bind(this);
		this.getBySlug = this.getBySlug.bind(this);
	}

	async getMinMax(match_query) {
		const [minMaxErrors, minMax] = await to(
			this.model.aggregate([
				{ $match: match_query },
				{ $project: { "salary.min": 1, "salary.max": 1 } },
				{ $group: { _id: "$_id", minValue: { $min: "$salary.min" }, maxValue: { $max: "$salary.max" } } },
				{ $group: { _id: null, minValue: { $min: "$minValue" }, maxValue: { $max: "$maxValue" } } },
			])
		);
		if (minMaxErrors) return { error: true, statusCode: 500, errors: minMaxErrors };
		return { error: false, statusCode: 200, data: minMax };
	}

	async getTags(match_query) {
		const [tagsErrors, tags] = await to(
			this.model.aggregate([
				{ $match: match_query },
				{ $project: { tags: 1 } },
				{ $unwind: "$tags" },
				{ $group: { _id: "$tags", count: { $sum: 1 } } },
				{ $project: { _id: 0, name: "$_id", count: 1 } },
				{ $sort: { count: -1 } },
			])
		);
		if (tagsErrors) return { error: true, statusCode: 500, errors: tagsErrors };
		return { error: false, statusCode: 200, data: tags };
	}

	async getBySlug(slug, logged_in_user) {
		const [jobErrors, job] = await to(
			this.model.findOne({
				slug,
				$or: [{ is_published: true }, { ...(logged_in_user && { created_by: logged_in_user._id }) }],
			})
		);
		if (jobErrors) return { error: true, statusCode: 500, errors: jobErrors };
		if (isEmpty(job)) return { error: true, statusCode: 404, errors: ["Not Found!"] };
		return { error: false, statusCode: 200, data: job };
	}
}

export default new JobService(Job);
