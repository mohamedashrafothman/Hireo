import Controller from "../utilities/Controller";

import DeviceService from "../services/Device";

class DeviceController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new DeviceController(DeviceService);
