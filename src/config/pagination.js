import mongoosePaginate from "mongoose-paginate-v2";

export default class Pagination {
	constructor() {
		if (!Pagination.instance) {
			mongoosePaginate.paginate.options = {
				select: "", // {Object | String} - Fields to return (by default returns all fields).
				population: {}, //  {Array | Object | String} - Paths which should be populated with other documents.
				pagination: true, // {Boolean} - If pagination is set to false, it will return all docs without adding limit condition. (Default: True)
				page: 1, // {Number}
				limit: 10, // {Number}
				skip: this.page * this.limit - this.limit, // {Number} - Use offset or page to set skip position
				sort: { created_at: "desc" }, // {Object | String} - Sort order.
				lean: false, // {Boolean} - Should return plain javascript objects instead of Mongoose documents?
				leanWithId: false, // {Boolean} - If lean and leanWithId are true, adds id field with string representation of _id to every document
			};
			Pagination.instance = this;
		}
		return Pagination.instance;
	}
}
