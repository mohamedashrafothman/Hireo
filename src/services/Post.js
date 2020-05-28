import to from "await-to-js";
import Service from "../utilities/Service";

export default class Post extends Service {
	constructor(model) {
		super(model);
		this.getTags = this.getTags.bind(this);
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
				{ $limit: 20 }
			])
		);
		if (tagsErrors) return { error: true, statusCode: 500, errors: tagsErrors };
		return { error: false, statusCode: 200, data: tags };
	}
}
