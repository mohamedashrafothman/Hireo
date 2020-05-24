import { isEmpty } from "lodash";
import to from "await-to-js";
import Service from "../utilities/Service";

export default class JobService extends Service {
	constructor(model) {
		super(model);
		this.getMinMax = this.getMinMax.bind(this);
		this.getTags = this.getTags.bind(this);
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
				{ $sort: { count: -1 } }
			])
		);
		if (tagsErrors) return { error: true, statusCode: 500, errors: tagsErrors };
		return { error: false, statusCode: 200, data: tags };
	}

	async getBySlug(slug, logged_in_user) {
		const [jobErrors, job] = await to(
			this.model
				.findOne(
					{ slug, $or: [{ is_published: true }, { ...(logged_in_user && { created_by: logged_in_user._id }) }] }
				)
				.populate({
					path: "created_by",
					select: "_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality",
					populate: [
						{ path: "profile.nationality", select: "name code -_id" },
						{ path: "account.picture", select: "path -_id" },
						{ path: "account.picture_sm", select: "path -_id" },
						{ path: "account.picture_md", select: "path -_id" },
						{ path: "account.picture_lg", select: "path -_id" }
					]
				})
				.populate({
					path: "category",
					select: "name parent childs"
				})
				.populate({
					path: "type",
					select: "name slug"
				})
				.populate({
					path: "applications",
					select: "created_by"
				})
				.populate({
					path: "attachments",
					select: "_id base extname path name"
				})
		);
		if (jobErrors) return { error: true, statusCode: 500, errors: jobErrors };
		if (isEmpty(job)) return { error: true, statusCode: 404, errors: ["Not Found!"] };
		return { error: false, statusCode: 200, data: job };
	}
}
