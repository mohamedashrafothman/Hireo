import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import mongoose from "mongoose";

import Attachment from "./Attachment.model";
import Post from "./Post.model";
import Job from "./Job.model";

import CategoryService from "../services/Category";
import AttachmentService from "../services/Attachment";
import PostService from "../services/Post";
import JobService from "../services/Job";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const CategorySchema = new mongoose.Schema(
	{
		name: {
			ar: {
				type: String,
				required: true,
				unique: true,
				trim: true,
				index: true,
			},
			en: {
				type: String,
				required: true,
				unique: true,
				trim: true,
				index: true,
			},
		},
		description: {
			ar: { type: String, required: true, index: true },
			en: { type: String, required: true, index: true },
		},
		picture: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
		parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
		children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
		icon: { type: mongoose.Schema.Types.ObjectId, ref: "Icon" },
		slug: {
			type: String,
			slug: "name.en",
			uniqueSlug: true,
			index: true,
			slugPaddingSize: 6,
		},
		jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

//
// ─── SCHEMA PLUGIN AND HOOKS ────────────────────────────────────────────────────
//
async function preFindMethod(next) {
	this.populate([{ path: "children" }, { path: "icon" }, { path: "picture" }]);
	next();
}

async function preFindOneMethod(next) {
	this.populate([{ path: "parent" }, { path: "children" }, { path: "icon" }, { path: "picture" }]);
	next();
}

async function preDeleteOneMethod(next) {
	const categoryService = new CategoryService(this.model);
	const attachmentService = new AttachmentService(Attachment);
	const postService = new PostService(Post);
	const jobService = new JobService(Job);

	const categoryReadResponse = await categoryService.readOne(this.getQuery());
	if (categoryReadResponse.error) return next(categoryReadResponse.errors);

	if (categoryReadResponse.data?.picture) {
		const deleteAttachmentResponse = await attachmentService.deleteOne({
			_id: categoryReadResponse.data?.picture?._id,
		});
		if (deleteAttachmentResponse.error) return next(deleteAttachmentResponse.errors);
	}

	if (categoryReadResponse.data?.posts?.length) {
		const deletePostsResponse = await postService.deleteMany({ _id: { $in: categoryReadResponse.data.posts } });
		if (deletePostsResponse.error) return next(deletePostsResponse.errors);
	}

	if (categoryReadResponse.data?.jobs?.length) {
		const deleteJobsResponse = await jobService.deleteMany({ _id: { $in: categoryReadResponse.data.jobs } });
		if (deleteJobsResponse.error) return next(deleteJobsResponse.errors);
	}

	next();
}

CategorySchema.plugin(mongoosePagination);
CategorySchema.plugin(slug);
CategorySchema.pre("find", preFindMethod);
CategorySchema.pre("findOne", preFindOneMethod);
CategorySchema.pre("deleteOne", preDeleteOneMethod);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Category = mongoose.model("Category", CategorySchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Category;
