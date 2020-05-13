import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const ConversationSchema = new mongoose.Schema({
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	status: { type: Number, default: 0 }, // 0 => inbox, 1 => archived, 2 => deleted
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
