import to from "await-to-js";
import { isEmpty } from "lodash";
import Service from "../utilities/Service";
import Post from "../models/Post.model";

class PostService extends Service {
	constructor(model) {
		super(model);
		this.getTags = this.getTags.bind(this);
	}

	async getTags(match_query) {
		const [tagsErrors, tags] = await to(
			this.model.aggregate([
				{ $match: match_query },
				{ $project: { tags: 1 } },
				{ $unwind: "$tags" },
				{ $group: { _id: "$tags", count: { $sum: 1 } } },
				{ $project: { _id: 0, name: "$_id", count: 1 } },
				{ $sort: { count: -1 } },
				{ $limit: 20 },
			])
		);
		if (tagsErrors) return { error: true, statusCode: 500, errors: tagsErrors };
		return { error: false, statusCode: 200, data: tags };
	}

	async getSinglePostPageBySlug(slug) {
		const [populateRecursiveErr, populateRecursive] = await to(
			this.constructPopulateConfigOption(3, "children", {
				match: { is_published: true, is_deleted: false },
				select: "_id parent children content created_by",
			})
		);
		if (populateRecursiveErr) return { error: true, statusCode: 500, errors: populateRecursiveErr };

		// Getting requested post using slug
		const [postErr, post] = await to(
			this.model
				.findOne({ slug, status: 1 })
				.populate({ path: "thumbnail.sm", select: "path name" })
				.populate({ path: "thumbnail.md", select: "path name" })
				.populate({ path: "thumbnail.lg", select: "path name" })
				.populate({ path: "category", select: "name _id" })
				.populate({
					path: "comments",
					match: {
						is_published: true,
						is_deleted: false,
						parent: { $eq: null },
					},
					select: "_id parent children content created_by",
					populate: [
						{
							path: "created_by",
							select: "_id slug email account",
						},
						populateRecursive,
					],
				})
				.select("slug title category tags content thumbnail created_at")
		);
		if (postErr) return { error: true, statusCode: 500, errors: postErr };
		if (isEmpty(post)) return { error: true, statusCode: 404, errors: ["Not Found!"] };

		// Getting next post based on _id timestamp
		const [nextPostErr, nextPost] = await to(
			this.model
				.findOne({ _id: { $gt: post._id }, status: 1 })
				.populate({ path: "thumbnail.sm", select: "path name" })
				.populate({ path: "thumbnail.md", select: "path name" })
				.populate({ path: "thumbnail.lg", select: "path name" })
				.populate({ path: "category", select: "name _id" })
				.select("slug title category tags content thumbnail created_at")
		);
		if (nextPostErr) return { error: true, statusCode: 500, errors: nextPostErr };

		// Getting prev post based on _id timestamp
		const [prevPostErr, prevPost] = await to(
			this.model
				.findOne({ _id: { $lt: post._id }, status: 1 })
				.populate({ path: "thumbnail.sm", select: "path name" })
				.populate({ path: "thumbnail.md", select: "path name" })
				.populate({ path: "thumbnail.lg", select: "path name" })
				.populate({ path: "category", select: "name _id" })
				.select("slug title category tags content thumbnail created_at")
		);
		if (prevPostErr) return { error: true, statusCode: 500, errors: prevPostErr };

		// Getting related posts
		const [relatedPostsErr, relatedPosts] = await to(
			this.model
				.find({
					_id: { $ne: post._id },
					status: 1,
					$or: [{ category: post.category._id }, { tags: { $in: post.tags } }],
				})
				.populate({ path: "thumbnail.sm", select: "path name" })
				.populate({ path: "thumbnail.md", select: "path name" })
				.populate({ path: "thumbnail.lg", select: "path name" })
				.populate({ path: "category", select: "name _id" })
				.select("slug title category tags content thumbnail created_at")
				.limit(2)
		);
		if (relatedPostsErr) return { error: true, statusCode: 500, errors: relatedPostsErr };

		return {
			error: false,
			statusCode: 200,
			data: {
				post,
				nextPost,
				prevPost,
				relatedPosts,
			},
		};
	}

	async getTrendingPostsByViews(options = { limit: 10, days: 1 }) {
		const [postsErr, posts] = await to(
			this.model.aggregate([
				{
					$match: {
						...(options.query?.q && {
							$or: [
								{
									title: {
										$regex: options.query.q.split(" ").filter(Boolean).join("|") || "",
										$options: "i",
									},
								},
								{
									content: {
										$regex: options.query.q.split(" ").filter(Boolean).join("|") || "",
										$options: "i",
									},
								},
							],
						}),
						...(options.query?.tags && options.query.tags.length && { tags: { $in: options.query.tags } }),
					},
				},
				{
					$lookup: {
						from: "devices",
						localField: "views.devices",
						foreignField: "_id",
						as: "views.devices",
					},
				},
				{ $unwind: "$views.devices" },
				{
					$match: {
						"views.devices.created_at": {
							$gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * options.days),
							$lte: new Date(),
						},
					},
				},
				{
					$project: {
						_id: 1,
						created_at: 1,
						"views.count": 1,
						"views.devices._id": 1,
						"views.devices.created_at": 1,
					},
				},
				{
					$group: {
						_id: {
							post: "$_id",
							day: { $dayOfMonth: "$views.devices.created_at" },
							month: { $month: "$views.devices.created_at" },
							year: { $year: "$views.devices.created_at" },
						},
						views_count: { $sum: 1 },
					},
				},
				{ $sort: { views_count: -1, "_id.day": -1 } },
				{
					$group: {
						_id: "$_id.post",
						views_count: { $sum: "$views_count" },
						average_views: { $avg: "$views_count" },
						views: { $push: "$views_count" },
					},
				},
				{
					$project: {
						_id: 1,
						views_count: 1,
						average_views: 1,
						standard_deviation: { $stdDevSamp: "$views" },
					},
				},
				{
					$project: {
						_id: 1,
						views_count: 1,
						zScore: {
							$cond: [
								{ $eq: ["$standard_deviation", 0] },
								0,
								{ $divide: [{ $subtract: ["$views_count", "$average_views"] }, "$standard_deviation"] },
							],
						},
					},
				},
				// uncomment this to enforce sorting from highest zScore to lowest, unless it will be shuffled.
				// { $sort: { zScore: -1 } },
				{
					$lookup: {
						from: "posts",
						localField: "_id",
						foreignField: "_id",
						as: "post",
					},
				},
				{ $unwind: "$post" },
				{ $limit: options.limit },
				{
					$lookup: {
						from: "attachments",
						let: { id: "$post.thumbnail.sm" },
						pipeline: [
							{ $match: { $expr: { $eq: ["$_id", "$$id"] } } },
							{ $project: { _id: 1, path: 1, name: 1 } },
						],
						as: "post.thumbnail.sm",
					},
				},
				{ $unwind: "$post.thumbnail.sm" },
				{
					$lookup: {
						from: "attachments",
						let: { id: "$post.thumbnail.md" },
						pipeline: [
							{ $match: { $expr: { $eq: ["$_id", "$$id"] } } },
							{ $project: { _id: 1, path: 1, name: 1 } },
						],
						as: "post.thumbnail.md",
					},
				},
				{ $unwind: "$post.thumbnail.md" },
				{
					$lookup: {
						from: "attachments",
						let: { id: "$post.thumbnail.lg" },
						pipeline: [
							{ $match: { $expr: { $eq: ["$_id", "$$id"] } } },
							{ $project: { _id: 1, path: 1, name: 1 } },
						],
						as: "post.thumbnail.lg",
					},
				},
				{ $unwind: "$post.thumbnail.lg" },
			])
		);

		if (postsErr) return { error: true, statusCode: 500, errors: postsErr };
		return { error: false, statusCode: 200, data: posts };
	}
}

export default new PostService(Post);
