import dotenv from "dotenv";

import fs from "fs";
import to from "await-to-js";
import glob from "glob";
import path from "path";
import { blue, red } from "chalk";
import { upperFirst, camelCase } from "lodash";
import MongoDBConnection from "../config/database";

import User from "../models/User.model";
import Icon from "../models/Icon.model";
import Skill from "../models/Skill.model";
import Category from "../models/Category.model";
import Nationality from "../models/Nationality.model";
import JobType from "../models/Job_type.model";

dotenv.config({
	path: `${__dirname}/../../.env`,
});

class Samples {
	constructor() {
		this.files = [];
		this.schemas = {
			User,
			Icon,
			Skill,
			Category,
			Nationality,
			JobType,
		};
		// Connecting to mongodb
		new MongoDBConnection();
		// getting all sample json files.
		glob(`${__dirname}/../samples/*.json`, {}, async (err, files) => {
			// exiting the process if there is an error.
			if (err) {
				console.log(err);
				process.exit();
			}
			// handling/reshaping each file data.
			await this.asyncForEach(files, async (file) => {
				const file_extension = path.extname(file);
				const file_name = path.basename(file, file_extension);
				const file_schema = upperFirst(camelCase(file_name));
				const file_data = JSON.parse(fs.readFileSync(file, "utf-8"));
				this.files = [
					...this.files,
					{
						file_extension,
						file_name,
						file_schema,
						file_data,
					},
				];
			});
			if (process.argv.includes("--drop")) {
				// calling drop data function if there is --drop argument flag.
				this.dropSamples(() => {
					console.log(`✅  ${blue("Data Deleted.")}`);
					process.exit();
				});
			} else {
				// calling load data function.
				this.loadSamples(() => {
					console.log(`✅  ${blue("Done!")}`);
					process.exit();
				});
			}
		});
	}

	async dropSamples(cb) {
		await this.asyncForEach(this.files, async (file) => {
			const [err] = await to(
				this.schemas[file.file_schema].deleteMany({})
			);
			if (err) {
				console.log(err);
				process.exit();
			}
		});

		if (cb) return cb();
	}

	async loadSamples(cb) {
		await this.asyncForEach(this.files, async (file) => {
			const [err] = await to(
				this.schemas[file.file_schema].insertMany(file.file_data)
			);
			if (err) {
				console.log(
					red(
						`⛔️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t ${blue(
							"npm run samples:drop"
						)}\n\n\n`
					)
				);
				console.log(err);
			}
		});

		if (cb) return cb();
	}

	async asyncForEach(array, cb) {
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < array.length; i++) {
			// eslint-disable-next-line no-await-in-loop
			await cb(array[i], i, array);
		}
	}
}

export default new Samples();
