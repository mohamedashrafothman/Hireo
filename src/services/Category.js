import { isEmpty } from "lodash";
import Service from "../utilities/Service";

export default class CategoryService extends Service {
	constructor(model) {
		super(model);
	}

	async addCategory(body) {
		const existedCategory = await this.readOne({ "name.en": body["name.en"] });
		if (existedCategory.error) return existedCategory;
		if (!isEmpty(existedCategory.data)) {
			return { error: true, statusCode: 202, errors: ["This category already exist."] };
		}

		const createdUser = await this.create(body);
		if (createdUser.error) return createdUser;

		if (body.parent) {
			const updatedParent = await this.updateOne(
				{ _id: body.parent },
				{ $addToSet: { children: createdUser.data._id } }
			);
			if (updatedParent.error) return updatedParent;
		}

		return createdUser;
	}

	async deleteCategory(query) {
		const readCategoryResponse = await this.readOne(query);
		if (readCategoryResponse.error) return readCategoryResponse;
		if (isEmpty(readCategoryResponse.data)) {
			return { error: true, statusCode: 404, errors: ["category not found."] };
		}

		if (!readCategoryResponse.data.children.length) {
			const deleteCategoryResponse = await this.deleteOne(query);
			if (deleteCategoryResponse.data?.parent?.children.length <= 1) {
				await this.deleteCategory(deleteCategoryResponse.data?.parent);
			}
			return deleteCategoryResponse;
		}

		const updateCategoryResponse = await this.updateOne(
			query,
			{
				$set: {
					"description.en": ".xX This category has been deleted Xx.",
					"description.ar": ".xX This category has been deleted Xx.",
					is_deleted: true,
				},
			}
		);
		return updateCategoryResponse;
	}

	async editCategory(query, body) {
		const existedCategory = await this.readOne(query);
		if (existedCategory.error) return existedCategory;
		if (isEmpty(existedCategory.data)) return { error: true, statusCode: 404, errors: ["Not Found"] };

		const updatedCategory = await this.updateOne(query, { $set: body });

		return updatedCategory;
	}
}
