import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const NationalitySchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		unique: true,
		index: true,
		required: "Nationality name is required."
	},
	code: {
		type: String,
		trim: true,
		unique: true,
		index: true,
		required: "Nationality code is required."
	}
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//
NationalitySchema.plugin(mongoosePagination);

//
// ─── SCHEMA model ───────────────────────────────────────────────────────────────
//
const Nationality = mongoose.model("Nationality", NationalitySchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Nationality;
