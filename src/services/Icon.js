import Service from "../utilities/Service";
import Icon from "../models/Icon.model";

class IconService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new IconService(Icon);
