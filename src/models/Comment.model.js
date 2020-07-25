import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const CommentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: "path {PATH} is required.",
		validate: [(val) => val.length <= 500, "{PATH} exceeds the limit of 500 letter."],
	},
	parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
	children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: "path {PATH} is required." },
	created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	created_from: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
	is_published: { type: Boolean, default: true },
	is_deleted: { type: Boolean, default: false }
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});


//
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//
CommentSchema.plugin(mongoosePagination);


//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Comment = mongoose.model("Comment", CommentSchema);


//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Comment;
