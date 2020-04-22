import { paginate } from "mongoose-paginate-v2";
import { validationResult } from "express-validator";

class Controller {
	constructor(service) {
		this.service = service;
		this.create = this.create.bind(this);
		this.readMany = this.readMany.bind(this);
		this.updateOne = this.updateOne.bind(this);
		this.updateMany = this.updateMany.bind(this);
		this.deleteOne = this.deleteOne.bind(this);
		this.deleteMany = this.deleteMany.bind(this);
	}

	async create(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			return res.status(422).json({ errors: err });
		}

		const response = await this.service.create(req.body);
		if (response.error) return next(response.errors);

		return res.status(response.statusCode).send(response);
	}

	async readMany(req, res, next) {
		const { query } = req;
		const { page = paginate.options.page, limit = paginate.options.limit } = query;

		if (query.page) delete query.page;
		if (query.limit) delete query.limit;

		const response = await this.service.read(query, { page, limit });
		if (response.error) return next(response.errors);

		if (!response.data.length && response.offset === undefined && response.page !== 1) {
			return res.redirect(req.prevPrevPath);
		}

		return res.status(response.statusCode).send(response);
	}

	async readOne(req, res, next) {
		const response = await this.service.readOne(req.query);
		if (response.error) return next(response.errors);
		return res.status(response.statusCode).send(response);
	}

	async updateOne(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			return res.status(422).json({ errors: err });
		}

		const response = await this.service.updateOne(req.query, req.body);
		if (response.error) return next(response.errors);

		return res.status(response.statusCode).send(response);
	}

	async updateMany(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			return res.status(422).json({ errors: err });
		}

		const response = await this.service.updateMany(req.query, req.body);
		if (response.error) return next(response.errors);

		return res.status(response.statusCode).send(response);
	}

	async deleteOne(req, res, next) {
		const response = await this.service.deleteOne(req.params.id);
		if (response.error) return next(response.errors);

		return res.status(response.statusCode).send(response);
	}

	async deleteMany(req, res, next) {
		const response = await this.service.deleteMany(req.params);
		if (response.error) return next(response.errors);

		return res.status(response.statusCode).send(response);
	}
}

export default Controller;
