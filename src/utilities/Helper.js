import crypto from "crypto";
import url from "url";

export default class Helper {
	constructor() {
		this.dump = this.dump.bind(this);
		this.staticMap = this.staticMap.bind(this);
		this.urlSegment = this.urlSegment.bind(this);
		this.createRandomToken = this.createRandomToken.bind(this);
		this.fullUrl = this.fullUrl.bind(this);
		this.kmToRadian = this.kmToRadian.bind(this);
		this.milesToRadian = this.milesToRadian.bind(this);
		this.nFormatter = this.nFormatter.bind(this);
	}

	dump(obj) { return JSON.stringify(obj, null, 2); }

	staticMap([lng, lat]) { return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`; }

	urlSegment(req) { return req.path.split("/"); }

	createRandomToken(byteNum) { return crypto.randomBytes(byteNum).toString("hex"); }

	fullUrl(req) { return url.format({ protocol: req.protocol, host: req.get("host"), pathname: req.originalUrl }); }

	kmToRadian(km) { return km / 6378; }

	milesToRadian(miles) { return miles / 3963; }

	nFormatter(num, digits) {
		const si = [
			{ value: 1, symbol: "" },
			{ value: 1E3, symbol: "k" },
			{ value: 1E6, symbol: "M" },
			{ value: 1E9, symbol: "G" },
			{ value: 1E12, symbol: "T" },
			{ value: 1E15, symbol: "P" },
			{ value: 1E18, symbol: "E" }
		];
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		let i;
		for (i = si.length - 1; i > 0; i--) {
			if (num >= si[i].value) {
				break;
			}
		}
		return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
	}
}
