import { body, validationResult } from "express-validator";
import Controller from "../utilities/Controller";

import SkillService from "../services/Skill";

import Skill from "../models/Skill.model";

const skillService = new SkillService(Skill);

class SkillController extends Controller {
	constructor(service) {
		super(service);
		this.getSkillsList = this.getSkillsList.bind(this);
		this.getEditSkills = this.getEditSkills.bind(this);
		this.addSkill = this.addSkill.bind(this);
		this.editSkill = this.editSkill.bind(this);
		this.deleteSkills = this.deleteSkills.bind(this);
	}

	validator(method) {
		switch (method) {
		case "add skill":
		case "edit skill":
			return [
				body("name.en").notEmpty().withMessage("Skill english name can't be empty!").trim()
					.escape(),
				body("name.ar").notEmpty().withMessage("Skill arabic name can't be empty!").trim()
					.escape(),
				body("description.en")
					.notEmpty()
					.withMessage("Skill english description can't be empty!")
					.trim()
					.escape(),
				body("description.ar")
					.notEmpty()
					.withMessage("Skill arabic description can't be empty!")
					.trim()
					.escape(),
			];
		default:
			return [];
		}
	}

	async getSkillsList(req, res, next) {
		const query = {
			...(req.query?.q && {
				$or: [
					{
						"name.en": {
							$regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
							$options: "i",
						},
					},
					{
						"name.ar": {
							$regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
							$options: "i",
						},
					},
					{
						"description.en": {
							$regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
							$options: "i",
						},
					},
					{
						"description.ar": {
							$regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
							$options: "i",
						},
					},
				],
			}),
		};
		const options = {
			...req.query,
		};

		const skillsListResponse = await this.service.readMany(query, options);
		if (skillsListResponse.error) return next(skillsListResponse.errors);

		if (
			!skillsListResponse.data.length
			&& skillsListResponse.offset === undefined
			&& skillsListResponse.page !== 1
		) {
			req.flash(
				"info",
				`Hey! you asked for page ${req.query.page || 1}. But that doesn't exist. So i put you on page ${
					skillsListResponse.pages
				}.`
			);
			return res
				.status(skillsListResponse.statusCode)
				.redirect(`/dashboard/skills/list?page=${skillsListResponse.pages}`);
		}

		res.render("dashboard/skills/list", {
			page_title: "Manage All Skills",
			...skillsListResponse,
			data: { skills: skillsListResponse.data },
			query: req.query,
		});
	}

	async getAddSkills(req, res) {
		res.render("dashboard/skills/add", { page_title: "Add a Skill" });
	}

	async getEditSkills(req, res, next) {
		const skillToEditResponse = await this.service.readOne({
			slug: req.params.slug,
		});
		if (skillToEditResponse.error) return next(skillToEditResponse.errors);

		res.status(skillToEditResponse.statusCode).render("dashboard/skills/edit", {
			page_title: "Edit a Skill",
			data: { skill: skillToEditResponse.data },
		});
	}

	async addSkill(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.render("dashboard/skills/add", {
				page_title: "Add a Skill",
				data: {
					old: req.body,
				},
				flashes: req.flash(),
			});
		}

		const skillAddedResponse = await this.service.create(req.body);
		if (skillAddedResponse.error) return next(skillAddedResponse.errors);

		req.flash("success", "New Skill added successfully");
		res.status(skillAddedResponse.statusCode).redirect("/dashboard/skills/list");
	}

	async editSkill(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.redirect("back");
		}

		const skillEditingResponse = await this.service.updateOne({ slug: req.params.slug }, { $set: req.body });
		if (skillEditingResponse.error) {
			return next(skillEditingResponse.errors);
		}

		req.flash("success", `successfully updated ${skillEditingResponse.data.name.en} data.`);
		res.status(skillEditingResponse).redirect("/dashboard/skills/list");
	}

	async deleteSkills(req, res, next) {
		const skillDeletionResponse = await this.service.deleteOne({ _id: req.params.id });
		if (skillDeletionResponse.error) {
			return next(skillDeletionResponse.errors);
		}

		req.flash("success", `Successfully deleted ${skillDeletionResponse.data.name.en}`);
		res.status(skillDeletionResponse.statusCode).redirect("/dashboard/skills/list");
	}
}

export default new SkillController(skillService);
