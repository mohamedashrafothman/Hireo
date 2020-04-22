import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const JobSchema = new mongoose.Schema({
	title: { type: String, required: "Job title is required", index: true },
	description: { type: String, index: true },
	slug: {
		type: String,
		slug: "title",
		uniqueSlug: true,
		index: true,
		slugPaddingSize: 6
	},
	tags: {
		type: [String],
		validate: [(val) => val.length <= 10, "{PATH} exceeds the limit of 10"],
		index: true
	},
	salary: {
		min: { type: Number, required: "Job minimum salary is required" },
		max: { type: Number, required: "Job maximum salary is required" },
	},
	location: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
			required: true
		},
		address: { type: String, required: "You must supply a location address" },
		coordinates: [{
			type: Number,
			required: "You must supply coordinates",
			index: true
		}] // coordinates[0] => longitude, coordinates[1] => latitude
	},
	type: { type: mongoose.Schema.Types.ObjectId, ref: "job_type", index: true },
	attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }],
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
	created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
	status: { type: Number, default: 1 }, // 1 => Running, 2 => completed, 3 => Expiring, 4 => Expired.
	is_active: { type: Boolean, default: 1 }, // 1 => active, 0 => not active
	is_published: { type: Boolean, default: 1 }, // 1 => published, 0 => no published
	refresh_count: { type: Number, default: 0 },
	expiring_at: { type: Date, default: +new Date() + 1000 * 60 * 60 * 24 * Number(process.env.JOB_EXPERATION_TIME_IN_DAYS) } // 30 Days = (ms * sec * min * hours * days)
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
JobSchema.plugin(mongoosePagination);
JobSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Job = mongoose.model("Job", JobSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Job;
