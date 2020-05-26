import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const PostSchema = new mongoose.Schema({
	title: { type: String, required: "Post title is required", index: true },
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
	content: { type: String, required: "Post content is required" },
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
	status: { type: Number, default: 1 }, // 1 => published, 2 => Drafted.
	created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
	thumbnail_sm: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
	thumbnail_md: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
	thumbnail_lg: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

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
