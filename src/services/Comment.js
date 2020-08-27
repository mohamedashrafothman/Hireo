import Service from "../utilities/Service";
import Comment from "../models/Comment.model";

class CommentService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new CommentService(Comment);
