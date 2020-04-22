import { isEmpty } from "lodash";
import path from "path";

import Controller from "../utilities/Controller";
import Attachment from "../models/Attachment.model";
import AttachmentService from "../services/Attachment";

const attachmentService = new AttachmentService(Attachment);

class AttachmentController extends Controller {
	constructor(service) {
		super(service);
	}

	async downloadAttachment(req, res, next) {
		const { attachment } = req.params;

		const attachmentReadResponse = await attachmentService.readOne({ _id: attachment });
		if (attachmentReadResponse.error) {
			if (isEmpty(attachmentReadResponse.data)) return next();
			return next(attachmentReadResponse.errors);
		}

		const storage_path_array = process.env.UPLOAD_STORAGE.split("/");
		const storage_path = storage_path_array.slice(0, storage_path_array.length - 1).join("/");
		res.download(path.resolve(__dirname, `../../${storage_path}`, attachmentReadResponse.data.path), attachmentReadResponse.data.name);
	}
}

export default new AttachmentController(attachmentService);
