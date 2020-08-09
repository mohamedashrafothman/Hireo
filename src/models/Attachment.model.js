import mongoose from "mongoose";
import mongoosePagination from "mongoose-paginate-v2";

import AttachmentService from "../services/Attachment";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const AttachmentSchema = new mongoose.Schema(
	{
		path: { type: String },
		dir: { type: String },
		name: { type: String },
		extname: { type: String },
		base: { type: String },
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

//
// ─── SCHEMA PLUGINS AND HOOKS ───────────────────────────────────────────────────
//
AttachmentSchema.plugin(mongoosePagination);

async function preDeleteOneMethod(next) {
	const attachmentService = new AttachmentService(this.model);

	const attachmentReadResponse = await attachmentService.readMany(this.getQuery());
	if (attachmentReadResponse.error) {
		return next(attachmentReadResponse.errors);
	}

	const attachmentFilesDeleteResponse = await attachmentService.handelFilesForDirDeletion(
		attachmentReadResponse.data.map((attachment) => attachment.path)
	);
	if (attachmentFilesDeleteResponse.error) {
		return next(attachmentFilesDeleteResponse.errors);
	}

	next();
}

AttachmentSchema.pre("deleteOne", preDeleteOneMethod);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Attachment = mongoose.model("Attachment", AttachmentSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Attachment;
