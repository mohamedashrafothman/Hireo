import Controller from "../utilities/Controller";
import Icon from "../models/Icon.model";
import IconService from "../services/Icon";

const iconService = new IconService(Icon);

class IconController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new IconController(iconService);
