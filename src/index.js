import "dotenv/config";
import { blue } from "chalk";
import MongoDBConnection from "./config/database";
import Pagination from "./config/pagination";
import "./config/passport";
import "./config/i18n";
import "./config/acl";
import server from "./config/server";

new MongoDBConnection();
new Pagination();

//
// ─── LISTEN TO SERVER ───────────────────────────────────────────────────────────
//
server.listen(server.get("port"), () => {
	console.log(`✅  App is running at ${blue(`http://localhost:${server.get("port")}`)} in ${server.get("env")} mode`);
	console.log(`⚠️  Press ${blue("CTRL-C")} to stop\n`);
});
