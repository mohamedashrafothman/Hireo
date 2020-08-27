import Controller from "../utilities/Controller";

import IconService from "../services/Icon";

class IconController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new IconController(IconService);
