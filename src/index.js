import "dotenv/config";
import { blue } from "chalk";
import "./config/passport";
import "./config/i18n";
import "./config/acl";
import Pagination from "./config/pagination";
import { server, app } from "./config/server";
import MongoDBConnection from "./config/database";


//
// ─── LISTEN TO SERVER ───────────────────────────────────────────────────────────
//
server.listen(app.get("port"), () => {
	console.log(`✅  App is running at ${blue(`http://localhost:${app.get("port")}`)} in ${app.get("env")} mode`);
	console.log(`⚠️  Press ${blue("CTRL-C")} to stop\n`);
	new MongoDBConnection();
	new Pagination();
});
