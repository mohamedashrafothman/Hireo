import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const ConversationSchema = new mongoose.Schema({
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	is_deleted: { type: Boolean, default: false },
	deleted_by: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		validate: [(val) => val.length <= 2, "{PATH} exceeds the limit of 2"]
	}
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
ConversationSchema.plugin(mongoosePagination);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Conversation = mongoose.model("Conversation", ConversationSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Conversation;
