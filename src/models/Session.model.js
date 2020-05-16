import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";


//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const SessionSchema = new mongoose.Schema({}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});


//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
SessionSchema.plugin(mongoosePagination);


//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Session = mongoose.model("Session", SessionSchema, process.env.SESSION_DATABASE_COLLECTION_NAME);


//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Session;
