import path from "path";
import i18n from "i18n";

class Internationalization {
	constructor() {
		i18n.configure({
			locales: ["en", "ar"],
			cookie: "lang",
			directory: path.join(path.dirname(__dirname), "/languages"), // where to store json files - defaults to './locales' relative to modules directory
			register: global,
			objectNotation: true,
			autoReload: true, // watch for changes in json files to reload locale on updates - defaults to false
		});
	}
}

export default new Internationalization();
