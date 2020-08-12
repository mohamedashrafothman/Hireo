import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const DeviceSchema = new mongoose.Schema(
	{
		ip: { type: String, max: 20, required: true },
		source: { type: String, required: true },
		browser: {
			name: { type: String, require: true },
			version: { type: String },
		},
		os: { type: String },
		platform: { type: String },
		post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
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
DeviceSchema.plugin(mongoosePagination);
DeviceSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Device = mongoose.model("Device", DeviceSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Device;
