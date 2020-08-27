import { blue, red } from "chalk";
import mongoose from "mongoose";

//
// ─── DATABASE CONNECTION ────────────────────────────────────────────────────────
// This ODM and database combination is extremely popular in the Node community,
// partially because the document storage and query system looks very much like JSON,
// and is hence familiar to JavaScript developers.
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Using_Mongoose_and_MongoDb_for_the_LocalLibrary
//
export default class MongoDBConnection {
	constructor() {
		if (!MongoDBConnection.instance) {
			mongoose.Promise = global.Promise;
			mongoose.set("useNewUrlParser", true);
			mongoose.set("useFindAndModify", false);
			mongoose.set("useCreateIndex", true);
			mongoose.set("useUnifiedTopology", true);
			mongoose.connect(process.env.MONGODB_URI);
			mongoose.connection
				.once("open", () => {
					console.log(blue.bold("✅  Connected to the database"));
				})
				.on("error", (error) => {
					console.error(error);
					console.log(
						`⛔️  ${red("MongoDB connection error")}.\n Please make sure MongoDB server is running.`
					);
					process.exit();
				});
			[this.db] = mongoose.connections;
			MongoDBConnection.instance = this;
		}

		return MongoDBConnection.instance;
	}
}
