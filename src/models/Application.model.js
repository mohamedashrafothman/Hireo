import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

import ApplicationService from "../services/Application";
import UserService from "../services/User";
import JobService from "../services/Job";
import AttachmentService from "../services/Attachment";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const ApplicationSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true },
		email: { type: String, lowercase: true, trim: true },
		status: { type: Number, default: 1 }, // 1 => Waiting, 2 => Withdrawn, 3 => Rejected, 4 => Accepted.
		attachment: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
		job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
		created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		was_seen: { type: Boolean, default: 0 }, // check if the application seen by the job creator.
		seen_at: { type: Date, default: undefined },
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
const preFindMethod = async function (next) {
	this.populate([
		{ path: "attachments", select: "_id base extname path name" },
		{ path: "job", select: "created_by title slug status" },
		{
			path: "created_by",
			select:
				"_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality",
		},
	]);
	next();
};

const preDeleteOneMethod = async function (next) {
	const readApplicationResponse = await ApplicationService.readOne(this.getQuery());
	if (readApplicationResponse?.error) return next(readApplicationResponse?.errors);

	if (readApplicationResponse?.data?.created_by?._id) {
		const updateUserResponse = await UserService.updateOne(
			{ _id: readApplicationResponse?.data?.created_by?._id },
			{ $pull: { applications: readApplicationResponse?.data?._id } }
		);
		if (updateUserResponse?.error) return next(updateUserResponse?.errors);
	}

	if (readApplicationResponse?.data?.job._id) {
		const updateJobResponse = await JobService.updateOne(
			{ _id: readApplicationResponse?.data?.job?._id },
			{ $pull: { applications: readApplicationResponse?.data?.id } }
		);
		if (updateJobResponse?.error) return next(updateJobResponse?.errors);
	}

	if (readApplicationResponse?.data?.attachments) {
		const deleteAttachmentResponse = await AttachmentService.deleteMany({
			_id: readApplicationResponse?.data?.attachment?._id,
		});
		if (deleteAttachmentResponse?.error) return next(deleteAttachmentResponse?.errors);
	}

	next();
};

ApplicationSchema.plugin(mongoosePagination);
ApplicationSchema.plugin(slug);
ApplicationSchema.pre("find", preFindMethod);
ApplicationSchema.pre("findOne", preFindMethod);
ApplicationSchema.pre("deleteOne", preDeleteOneMethod);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Application = mongoose.model("Application", ApplicationSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Application;
