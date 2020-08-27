import Service from "../utilities/Service";
import Device from "../models/Device.model";

class DeviceService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new DeviceService(Device);
