import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const PostSchema = new mongoose.Schema(
	{
		title: { type: String, required: "Post title is required", index: true },
		slug: {
			type: String,
			slug: "title",
			uniqueSlug: true,
			index: true,
			slugPaddingSize: 6,
		},
		tags: {
			type: [String],
			validate: [(val) => val.length <= 10, "{PATH} exceeds the limit of 10"],
			index: true,
		},
		content: { type: String, required: "Post content is required" },
		category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
		status: { type: Number, default: 1 }, // 1 => published, 2 => Drafted.
		created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		thumbnail: {
			sm: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
			md: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
			lg: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
		},
		views: {
			count: { type: Number },
			devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
		},
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
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
PostSchema.plugin(mongoosePagination);
PostSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Post = mongoose.model("Post", PostSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Post;
