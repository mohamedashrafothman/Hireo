import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const ApplicationSchema = new mongoose.Schema({
	name: { type: String, trim: true },
	email: { type: String, lowercase: true, trim: true },
	status: { type: Number, default: 1 }, // 1 => Waiting, 2 => Withdrawn, 3 => Rejected, 4 => Accepted.
	attachment: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
	job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
	created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	was_seen: { type: Boolean, default: 0 }, // check if the application seen by the job creator.
	seen_at: { type: Date, default: undefined }
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
ApplicationSchema.plugin(mongoosePagination);
ApplicationSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Application = mongoose.model("Application", ApplicationSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Application;
