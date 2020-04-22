import _ from "lodash";
import fs from "fs";
import path from "path";
import slug from "slug";
import Jimp from "jimp";
import mkdirp from "mkdirp";
import crypto from "crypto";
import concat from "concat-stream";
import streamifier from "streamifier";

export default class StorageEngine {
	constructor(opts) {
		// TODO: Add ability to save file compressed.
		const ALLOWED_STORAGE_SYSTEMS = ["local"];
		const ALLOWED_OUTPUT_FORMATS = ["image", "application"];
		const ALLOWED_IMAGE_SIZES = ["lg", "md", "sm"];
		const DEFAULT_OPTIONS = {
			storage: "local",
			accept: ["image", "application"],
			sizes: ["lg", "md", "sm"],
			upload_path: path.resolve(__dirname, "../..", process.env.UPLOAD_STORAGE),
			upload_base_path: `/${process.env.UPLOAD_STORAGE.split(path.sep)[process.env.UPLOAD_STORAGE.split(path.sep).length - 1]}`,
			quality: 70,
			square: true,
			threshold: 500,
			greyscale: false,
			responsive: false,
			fileHashName: true
		};

		// extend default options with passed options
		let options = (opts && _.isObject(opts)) ? _.pick(opts, _.keys(DEFAULT_OPTIONS)) : {};
		options = _.assign(DEFAULT_OPTIONS, options);

		this.options = options;
		this.ALLOWED_IMAGES_FORMATS = ["jpg", "jpeg", "png", "bmp", "tiff", "gif"];
		this.ALLOWED_APPLICATIONS_FORMATS = ["pdf", "xlsx", "xls", "docs", "doc", "docx"];

		// check the options for correct values and use fallback value where necessary
		this.options = _.forIn(options, (value, key, object) => {
			switch (key) {
			case "square":
			case "greyscale":
			case "responsive":
			case "fileHashName":
				object[key] = _.isBoolean(value) ? value : DEFAULT_OPTIONS[key];
				break;
			case "upload_path":
				value = String(value).toLowerCase();
				object[key] = _.isEqual(DEFAULT_OPTIONS[key], value) ? value : DEFAULT_OPTIONS[key];
				break;
			case "upload_base_path":
				value = String(value).toLowerCase();
				object[key] = _.isEqual(DEFAULT_OPTIONS[key], value) ? value : DEFAULT_OPTIONS[key];
				break;
			case "storage":
				value = String(value).toLowerCase();
				object[key] = _.includes(ALLOWED_STORAGE_SYSTEMS, value) ? value : DEFAULT_OPTIONS[key];
				break;
			case "quality":
				value = _.isFinite(value) ? value : Number(value);
				object[key] = (value && value >= 0 && value <= 100) ? value : DEFAULT_OPTIONS[key];
				break;
			case "threshold":
				value = _.isFinite(value) ? value : Number(value);
				object[key] = (value && value >= 0) ? value : DEFAULT_OPTIONS[key];
				break;
			case "sizes":
				value = value.map((val) => String(val).toLowerCase());
				object[key] = _.includes(ALLOWED_IMAGE_SIZES, value) ? value : DEFAULT_OPTIONS[key];
				break;
			case "accept":
				value = value.map((single_value) => String(single_value).toLowerCase());
				object[key] = _.includes(ALLOWED_OUTPUT_FORMATS, value) ? value : DEFAULT_OPTIONS[key];
				break;
			default:
				break;
			}
		});

		// set the upload path
		this.options.upload_path = (_.includes(this.options.accept, "image") && this.options.responsive) ? path.join(this.options.upload_path, "responsive") : this.options.upload_path;

		// set the upload base url
		this.options.upload_base_path = (_.includes(this.options.accept, "image") && this.options.responsive) ? path.join(this.options.upload_base_path, "responsive") : this.options.upload_base_path;
		if (this.options.storage === "local") {
			// if upload path does not exist, create the upload path structure
			if (!fs.existsSync(this.options.upload_path)) mkdirp.sync(this.options.upload_path);
		}

		this._generateRandomFileName = this._generateRandomFileName.bind(this);
		this._createOutputStream = this._createOutputStream.bind(this);
		this._createReadStream = this._createReadStream.bind(this);
		this._processImageFiles = this._processImageFiles.bind(this);
		this._processApplicationFiles = this._processApplicationFiles.bind(this);
		this._handleFile = this._handleFile.bind(this);
		this._removeFile = this._removeFile.bind(this);
	}

	_generateRandomFileName(mime) {
		// create pseudo random bytes
		const bytes = crypto.pseudoRandomBytes(32);
		// create the md5 hash of the random bytes
		const checksum = crypto.createHash("MD5").update(bytes).digest("hex");
		// return as filename the hash with the output extension
		return `${checksum}.${mime}`;
	}

	_createOutputStream(filepath, cb) {
		// create a reference for this to use in local functions
		const that = this;
		// create a writable stream from the filepath
		const output = fs.createWriteStream(filepath);
		// set callback fn as handler for the error event
		output.on("error", cb);
		// set handler for the finish event
		output.on("finish", () => {
			cb(null, {
				destination: that.options.upload_path,
				baseUrl: that.options.upload_base_path,
				filename: path.basename(filepath),
				storage: that.options.storage
			});
		});
		// return the output stream
		return output;
	}

	_createReadStream(filepath, cb) {
		// create a reference for this to use in local functions
		const that = this;
		// create a readable stream from the filepath
		const output = fs.createReadStream(filepath);
		// set callback fn as handler for the error event
		output.on("error", cb);
		// set handler for the finish event
		output.on("finish", () => {
			cb(null, {
				destination: that.options.upload_path,
				baseUrl: that.options.upload_base_path,
				filename: path.basename(filepath),
				storage: that.options.storage
			});
		});
		// return the output stream
		return output;
	}

	_processImageFiles(image, originalFile, cb) {
		// create a reference for this to use in local functions
		const that = this;
		let batch = [];
		// the responsive sizes
		const { sizes, threshold } = this.options;
		const nameArray = originalFile.originalname.split(".");
		const mimeType = nameArray[nameArray.length - 1];

		if (!that.ALLOWED_IMAGES_FORMATS.includes(mimeType)) {
			return cb(new Error("Unaccepted images file format"));
		}

		const originalFilename = `${slug(originalFile.originalname.split(".")[0])}.${mimeType}`;
		const filename = (this.options.fileHashName) ? this._generateRandomFileName(mimeType) : originalFilename;
		// resolve the Jimp output mime type
		const mime = Jimp[`MIME_${mimeType.toUpperCase()}`] || Jimp.MIME_PNG;
		// create a clone of the Jimp image
		let clone = image.clone();
		// fetch the Jimp image dimensions
		const { width, height } = clone.bitmap;
		let square = Math.min(width, height);
		// auto scale the image dimensions to fit the threshold requirement
		if (threshold && square > threshold) {
			clone = (square === width) ? clone.resize(threshold, Jimp.AUTO) : clone.resize(Jimp.AUTO, threshold);
		}
		// crop the image to a square if enabled
		if (this.options.square) {
			if (threshold) {
				square = Math.min(square, threshold);
			}
			// fetch the new image dimensions and crop
			clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
		}
		// convert the image to greyscale if enabled
		if (this.options.greyscale) {
			clone = clone.greyscale();
		}
		// set the image output quality
		clone = clone.quality(this.options.quality);
		if (this.options.responsive) {
			// map through  the responsive sizes and push them to the batch
			batch = _.map(sizes, (size) => {
				let outputStream = null;
				let imageClone = null;
				let filepath = filename.split(".");
				// create the complete filepath and create a writable stream for it
				filepath = `${filepath[0]}_${size}.${filepath[1]}`;
				filepath = path.join(that.options.upload_path, filepath);
				outputStream = that._createOutputStream(filepath, cb);
				// scale the image based on the size
				switch (size) {
				case "sm":
					imageClone = clone.clone().scale(0.3);
					break;
				case "md":
					imageClone = clone.clone().scale(0.7);
					break;
				case "lg":
					imageClone = clone.clone();
					break;
				default:
					break;
				}
				// return an object of the stream and the Jimp image
				return {
					stream: outputStream,
					image: imageClone
				};
			});
		} else {
			// push an object of the writable stream and Jimp image to the batch
			batch.push({
				stream: that._createOutputStream(path.join(that.options.upload_path, filename), cb),
				image: clone
			});
		}
		// process the batch sequence
		_.each(batch, (current) => {
			// get the buffer of the Jimp image using the output mime type
			current.image.getBuffer(mime, (err, buffer) => {
				if (that.options.storage === "local") {
					// create a read stream from the buffer and pipe it to the output stream
					streamifier.createReadStream(buffer).pipe(current.stream);
				}
			});
		});
	}

	_processApplicationFiles(file, originalFile, cb) {
		// create a reference for this to use in local functions
		const that = this;
		// create a reference for this to use in local functions
		const batch = [];
		const nameArray = originalFile.originalname.split(".");
		const mimeType = nameArray[nameArray.length - 1];

		if (!that.ALLOWED_APPLICATIONS_FORMATS.includes(mimeType)) {
			return cb(new Error("Unaccepted application file format"));
		}

		const originalFilename = `${slug(originalFile.originalname.split(".")[0])}.${mimeType}`;
		const filename = (this.options.fileHashName) ? this._generateRandomFileName(mimeType) : originalFilename;

		batch.push({
			stream: that._createOutputStream(path.join(that.options.upload_path, filename), cb),
			file
		});

		// process the batch sequence
		_.each(batch, (current) => {
			if (that.options.storage === "local") {
				// create a read stream from the buffer and pipe it to the output stream
				streamifier.createReadStream(current.file).pipe(current.stream);
			}
		});
	}

	_handleFile(req, file, cb) {
		// create a reference for this to use in local functions
		const that = this;
		// create a writable stream using concat-stream that will
		// concatenate all the buffers written to it and pass the
		// complete buffer to a callback fn
		const fileManipulate = concat((fileData) => {
			if (file.mimetype.startsWith("image")) {
				// read the fileBuffer buffer with Jimp
				// it returns a promise
				Jimp.read(fileData)
					.then((fileBuffer) => {
						// process the Jimp fileBuffer
						that._processImageFiles(fileBuffer, file, cb);
					})
					.catch(cb);
			} else if (file.mimetype.startsWith("application")) {
				that._processApplicationFiles(fileData, file, cb);
			} else {
				return cb(new Error("Unaccepted file type."));
			}
		});
		// write the uploaded file buffer to the fileManipulate stream
		file.stream.pipe(fileManipulate);
	}

	_removeFile(req, file, cb) {
		let matches = null;
		let pathsplit = null;
		const filename = file.originalname;
		const _path = path.join(this.options.upload_path, filename);
		let paths = [];
		// delete the file properties
		delete file.originalname;
		delete file.destination;
		delete file.baseUrl;
		delete file.storage;
		// create paths for responsive images
		if (this.options.responsive) {
			pathsplit = path.parse(_path);
			matches = pathsplit.base.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(.+)$/i);
			if (matches) {
				paths = _.map(["lg", "md", "sm"], (size) => `${path.format(pathsplit)}${path.sep}${matches[1]}_${size}.${matches[2]}`);
			}
		} else {
			paths = [_path];
		}
		// delete the files from the filesystem
		_.each(paths, (_unlinkPath) => {
			fs.unlink(_unlinkPath, cb);
		});
	}
}
