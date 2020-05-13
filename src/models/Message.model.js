import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const MessageSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	conversation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Conversation",
		required: true,
		index: true
	},
	content: {
		type: String,
		max: 255,
		required: true,
		trim: true
	},
	was_read: { type: Boolean, default: 0 }
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
MessageSchema.plugin(mongoosePagination);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Message = mongoose.model("Message", MessageSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Message;
