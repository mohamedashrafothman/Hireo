import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const IconSchema = new mongoose.Schema({
	name: { type: String, index: true },
	type: { type: String, index: true }
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
IconSchema.plugin(mongoosePagination);
IconSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Icon = mongoose.model("Icon", IconSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Icon;
