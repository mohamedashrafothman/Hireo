import Controller from "../utilities/Controller";

import Device from "../models/Device.model";
import DeviceService from "../services/Device";

const deviceService = new DeviceService(Device);

class DeviceController extends Controller {
	constructor(service) {
		super(service);
	}
}

export default new DeviceController(deviceService);
