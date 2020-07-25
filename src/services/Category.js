import to from "await-to-js";
import { isEmpty } from "lodash";
import Service from "../utilities/Service";

export default class CategoryService extends Service {
	constructor(model) {
		super(model);
		this.getEditCategoryData = this.getEditCategoryData.bind(this);
	}

	async addCategory(body) {
		const existedCategory = await this.readOne({ "name.en": body["name.en"] });
		if (existedCategory.error) return existedCategory;
		if (!isEmpty(existedCategory.data)) return { error: true, statusCode: 202, errors: ["This category already exist."] };

		const createdUser = await this.create(body);
		if (createdUser.error) return createdUser;

		if (body.parent) {
			const updatedParent = await this.updateOne({ _id: body.parent }, { $addToSet: { children: createdUser.data._id } });
			if (updatedParent.error) return updatedParent;
		}

		return createdUser;
	}

	async deleteCategory(id) {
		const deletedCategories = await this.deleteMany({ $or: [{ _id: id }, { parent: id }] }, { pagination: false });
		if (deletedCategories.error) return deletedCategories;

		const updatedCategories = await this.updateMany({
			$or: [{
				children: deletedCategories.data.map((category) => category._id)
			}, {
				parent: deletedCategories.data.map((category) => category._id)
			}]
		}, {
			$pull: {
				children: deletedCategories.data.map((category) => category._id),
				parent: deletedCategories.data.map((category) => category._id)
			}
		});
		if (updatedCategories.error) return updatedCategories;

		return deletedCategories;
	}

	async getEditCategoryData(slug) {
		const [err, categories] = await to(
			this.model
				.findOne({ slug })
				.populate("parent children icon picture")
		);
		if (err) return { error: true, statusCode: 500, errors: err };
		if (!categories) return { error: true, statusCode: 404, errors: ["Not Found"] };
		return { error: false, statusCode: 200, data: categories };
	}

	async editCategory(slug, body) {
		const existedCategory = await this.readOne({ slug });
		// console.log(existedCategory);
		if (existedCategory.error) return existedCategory;
		if (isEmpty(existedCategory.data)) return { error: true, statusCode: 404, errors: ["Not Found"] };

		const updatedCategory = await this.updateOne({ slug }, { $set: body });
		if (updatedCategory.error) return updatedCategory;
		return updatedCategory;
	}
}
