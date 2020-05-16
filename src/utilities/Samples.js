import dotenv from "dotenv";

import fs from "fs";
import to from "await-to-js";
import { blue, red } from "chalk";
import MongoDBConnection from "../config/database";

import User        from "../models/User.model";
import Icon        from "../models/Icon.model";
import Skill       from "../models/Skill.model";
import Category    from "../models/Category.model";
import Nationality from "../models/Nationality.model";
import JobType     from "../models/Job_type.model";

dotenv.config({ path: `${__dirname}/../../.env` });

class Samples {
	constructor(users, skills, nationalities, icons, categories, jobType) {
		this.users = users;
		this.skills = skills;
		this.nationalities = nationalities;
		this.icons = icons;
		this.categories = categories;
		this.jobType = jobType;

		// Connecting to mongodb
		new MongoDBConnection();

		this.users = this.readJsonFiles(`${__dirname}/../samples/users.json`);
		this.skills = this.readJsonFiles(`${__dirname}/../samples/skills.json`);
		this.nationalities = this.readJsonFiles(`${__dirname}/../samples/nationalities.json`);
		this.icons = this.readJsonFiles(`${__dirname}/../samples/icons.json`);
		this.categories = this.readJsonFiles(`${__dirname}/../samples/categories.json`);
		this.jobType = this.readJsonFiles(`${__dirname}/../samples/job_type.json`);

		if (process.argv.includes("--drop")) { this.dropSamples(); } else { this.loadSamples(); }
	}

	readJsonFiles(path) { return JSON.parse(fs.readFileSync(path, "utf-8")); }

	async dropSamples() {
		const [removeUsersError] = await to(User.deleteMany({}));
		if (removeUsersError) {
			console.log(removeUsersError);
			process.exit();
		}

		const [removeSkillsError] = await to(Skill.deleteMany({}));
		if (removeSkillsError) {
			console.log(removeSkillsError);
			process.exit();
		}

		const [removeNationalitiesError] = await to(Nationality.deleteMany({}));
		if (removeNationalitiesError) {
			console.log(removeNationalitiesError);
			process.exit();
		}

		const [removeIconsError] = await to(Icon.deleteMany({}));
		if (removeIconsError) {
			console.log(removeIconsError);
			process.exit();
		}

		const [removeCategoriesError] = await to(Category.deleteMany({}));
		if (removeCategoriesError) {
			console.log(removeCategoriesError);
			process.exit();
		}

		const [removeJobTypeError] = await to(JobType.deleteMany({}));
		if (removeJobTypeError) {
			console.log(removeJobTypeError);
			process.exit();
		}

		console.log(`✅  ${blue("Data Deleted.")}`);
		process.exit();
	}

	async loadSamples() {
		const [saveUsersError] = await to(User.insertMany(this.users));
		if (saveUsersError) {
			console.log(red(`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue("npm run blowitallaway")}\n\n\n`));
			console.log(saveUsersError);
		}

		const [saveSkillsError] = await to(Skill.insertMany(this.skills));
		if (saveSkillsError) {
			console.log(red(`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue("npm run blowitallaway")}\n\n\n`));
			console.log(saveSkillsError);
		}

		const [saveNationalitiesError] = await to(Nationality.insertMany(this.nationalities));
		if (saveNationalitiesError) {
			console.log(red(`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue("npm run blowitallaway")}\n\n\n`));
			console.log(saveNationalitiesError);
		}

		const [saveIconsError] = await to(Icon.insertMany(this.icons));
		if (saveIconsError) {
			console.log(red(`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue("npm run blowitallaway")}\n\n\n`));
			console.log(saveIconsError);
		}

		const [saveCategoriesError] = await to(Category.insertMany(this.categories));
		if (saveCategoriesError) {
			console.log(red(`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue("npm run blowitallaway")}\n\n\n`));
			console.log(saveCategoriesError);
		}

		const [saveJobTypeError] = await to(JobType.insertMany(this.jobType));
		if (saveJobTypeError) {
			console.log(red(`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue("npm run blowitallaway")}\n\n\n`));
			console.log(saveJobTypeError);
		}

		console.log(`✅  ${blue("Done!")}`);
		process.exit();
	}
}

export default new Samples();
