import path from "path";
import fs from "fs";
import url from "url";
import Service from "../utilities/Service";
import StorageEngine from "../utilities/StorageEngine";
import Attachment from "../models/Attachment.model";

class AttachmentService extends Service {
	constructor(model) {
		super(model);
		this.handelFilesForDBCreation = this.handelFilesForDBCreation.bind(this);
		this.handelFilesForDirDeletion = this.handelFilesForDirDeletion.bind(this);
		this.initStorageEngine = this.initStorageEngine.bind(this);
	}

	initStorageEngine(opts) {
		const storageEngine = new StorageEngine(opts);
		this.options = storageEngine.options;
		return storageEngine;
	}

	handelFilesForDBCreation(files, base) {
		return files.map((file) => {
			const nameParser = file.filename.split(".");
			const upload_path = this.options.upload_path.split(this.options.responsive ? path.sep : "/");
			const url_Path = (size) => path
				.join(
					`${upload_path.slice(1, upload_path.length).join(this.options.responsive ? path.sep : "/")}`,
					size
						? `${file.filename
							.split("_")
							.slice(0, file.filename.split("_").length - 1)}_${size}.${nameParser.slice(
							nameParser.length - 1
						)}`
						: file.filename
				)
				.replace(/[\\\/]+/g, this.options.responsive ? path.sep : "/")
				.replace(/^[\/]+/g, "");
			const dir = path
				.join(`${upload_path.slice(1, upload_path.length).join(this.options.responsive ? path.sep : "/")}`)
				.replace(/[\\\/]+/g, this.options.responsive ? path.sep : "/")
				.replace(/^[\/]+/g, "");

			const file_data =				this.options.responsive && this.options.sizes.length > 0
				? this.options.sizes.map((size) => ({
					path:
								process.env.NODE_ENV.trim() === "development"
									? `${url_Path(size)}`
									: `${base}/${url_Path()}`,
					dir: process.env.NODE_ENV.trim() === "development" ? `${dir}` : `${base}/${dir}`,
					name: `${file.filename
						.split("_")
						.slice(0, file.filename.split("_").length - 1)}_${size}.${nameParser.slice(
						nameParser.length - 1
					)}`,
					extname: `${nameParser.slice(nameParser.length - 1)}`,
					base: `${file.filename.split("_").slice(0, file.filename.split("_").length - 1)}_${size}`,
				}))
				: [
					{
						path:
									process.env.NODE_ENV.trim() === "development"
										? `${url_Path()}`
										: `${base}/${url_Path()}`,
						dir: process.env.NODE_ENV.trim() === "development" ? `${dir}` : `${base}/${dir}`,
						name: file.filename,
						extname: `${nameParser.slice(nameParser.length - 1)}`,
						base: `${nameParser.slice(0, nameParser.length - 1)}`,
					},
				];
			return file_data;
		});
	}

	async handelFilesForDirDeletion(filePaths) {
		if (!Array.isArray(filePaths)) {
			return {
				error: true,
				statusCode: 500,
				errors: ["handelFilesForDirDeletion() method takes paths in an array format"],
			};
		}

		filePaths.filter(Boolean).forEach(async (file) => {
			const upload_path_array = process.env.UPLOAD_STORAGE.split("/").filter(Boolean);
			const upload_path = upload_path_array.slice(0, upload_path_array.length - 1).join("/");

			const filePath = path.join(__dirname, `../../${upload_path}`, url.parse(file).path);
			fs.unlink(filePath, (err) => {
				if (err) {
					return { error: true, statusCode: 500, errors: err };
				}
				return { error: false, statusCode: 200, data: {} };
			});
		});

		return { error: false, statusCode: 200, data: {} };
	}
}

export default new AttachmentService(Attachment);
