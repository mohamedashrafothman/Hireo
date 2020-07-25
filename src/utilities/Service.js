import { isEmpty } from "lodash";
import to from "await-to-js";

/**
 * TODO: Update all wrap regular (non-JSONP) responses with the following properties:
		code,		- Contains the HTTP response status code as an integer.
		status, 	- Contains the text: “success”, “fail”, or “error”. Where “fail” is for HTTP status
						response values from 500-599, “error” is for statuses 400-499, and “success” is for everything
						else (e.g. 1XX, 2XX and 3XX responses).
		message, 	- Only used for “fail” and “error” statuses to contain the error message. For
						internationalization (i18n) purposes, this could contain a message number or code, either alone
						or contained within delimiters.
		data 		- That contains the response body. In the case of “error” or “fail” statuses, this contains the
						cause, or exception name.
 */


export default class Service {
	constructor(model) {
		this.model = model;
		this.create = this.create.bind(this);
		this.readOne = this.readOne.bind(this);
		this.readMany = this.readMany.bind(this);
		this.updateOne = this.updateOne.bind(this);
		this.updateMany = this.updateMany.bind(this);
		this.deleteOne = this.deleteOne.bind(this);
		this.deleteMany = this.deleteMany.bind(this);
	}

	async create(data) {
		const [err, item] = await to(this.model.create(data));
		if (err) return { error: true, statusCode: 500, errors: err };

		return { error: false, statusCode: 201, data: item };
	}

	async readMany(query, options) {
		const [err, cursor] = await to(this.model.paginate(query, options));
		if (err) return { error: true, statusCode: 500, errors: err };

		return {
			error: false,
			statusCode: 200,
			data: cursor.docs,
			page: cursor.page,
			pages: cursor.totalPages,
			total: cursor.totalDocs,
			limit: cursor.limit,
			prevPage: cursor.prevPage,
			nextPage: cursor.nextPage,
			hasPrevPage: cursor.hasPrevPage,
			hasNextPage: cursor.hasNextPage,
		};
	}

	async readOne(query) {
		const [err, item] = await to(this.model.findOne(query));
		if (err) return { error: true, statusCode: 500, errors: err };

		return { error: false, statusCode: 200, data: item };
	}

	async updateOne(query, data) {
		const [err, item] = await to(this.model.findOneAndUpdate(query, data, { new: true }));
		if (err) return { error: true, statusCode: 500, errors: err };

		return { error: false, statusCode: 202, data: item };
	}

	async updateMany(query, data) {
		const [err, items] = await to(this.model.updateMany(query, data, { new: true, multi: true }));
		if (err) return { error: true, statusCode: 500, errors: err };

		return { error: false, statusCde: 202, data: items };
	}

	async deleteOne(query) {
		const items = await this.readOne(query);
		if (items.error) return items;
		if (isEmpty(items.data)) return { error: true, statusCode: 404, errors: new Error("Data not found") };

		const [deleteErr] = await to(this.model.deleteOne(query));
		if (deleteErr) {
			return {
				error: true,
				deleted: false,
				statusCode: 500,
				errors: deleteErr
			};
		}

		return {
			error: false,
			deleted: true,
			statusCode: 202,
			data: items.data
		};
	}

	async deleteMany(query, options) {
		const items = await this.readMany(query, options);
		if (items.error) return items;

		const [deletedErr] = await to(this.model.deleteMany(query));
		if (deletedErr) {
			return {
				error: true,
				deleted: false,
				statusCode: 500,
				errors: deletedErr
			};
		}

		return {
			error: false,
			deleted: true,
			statusCode: 202,
			data: items.data
		};
	}

	async constructPopulateConfigOption(level, path, options) {
		let obj = { path };

		while (level) {
			if (level !== 1) {
				obj.populate = { ...obj, ...options };
			}

			obj = { ...obj, ...options };

			--level;
		}

		return obj;
	}
}
