import _ from "lodash";
import qs from "qs";
import to from "await-to-js";
import path from "path";
import csrf from "csurf";
import http from "http";
import i18n from "i18n";
import back from "express-back";
import flash from "connect-flash";
import moment from "moment";
import logger from "morgan";
import express from "express";
import session from "express-session";
import favicon from "serve-favicon";
import passport from "passport";
import socketio from "socket.io";
import bodyParser from "body-parser";
import compression from "compression";
import connectMongo from "connect-mongo";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";
import loggerToMongo from "mongo-morgan-ext";

import Helper from "../utilities/Helper";
import CronJobs from "../utilities/CronJobs";
import Socket from "../utilities/Socket";

import Message from "../models/Message.model";
import Category from "../models/Category.model";
import Application from "../models/Application.model";
import Conversation from "../models/Conversation.model";

import MessageService from "../services/Message";
import CategoryService from "../services/Category";
import ApplicationService from "../services/Application";
import ConversationService from "../services/Conversation";

import indexRouter from "../routes/index.route";

const MongoStore = connectMongo(session);
const helper = new Helper();
const messageService = new MessageService(Message);
const categoryService = new CategoryService(Category);
const applicationService = new ApplicationService(Application);
const conversationService = new ConversationService(Conversation);


//
// ─── APP INSTANCE ───────────────────────────────────────────────────────────────
//
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	saveUninitialized: false, // NOTE: Don't create session until something stored.
	resave: false, // NOTE: Don't save session if unmodified.
	store: new MongoStore({
		url: process.env.MONGODB_URI,
		ttl: 60 * 60 * process.env.SESSION_TIMEOUT_IN_HOURS, // COMMENT: Time to remove session from database in hours.
		resave: false,
		autoReconnect: true,
		autoRemove: "native",
		autoRemoveInterval: 1
	})
});


//
// ─── MIDDLEWARE FUNCTIONS ───────────────────────────────────────────────────────
// Express is a routing and middleware web framework that has minimal functionality of
// its own: An Express application is essentially a series of middleware function calls.
// http://expressjs.com/en/guide/using-middleware.html
//
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "pug");
app.set("permission", {
	role: "role",
	notAuthenticated: {
		flashType: "error",
		message: "<strong>Not Authenticated!</strong><br><p>Make sure you're logged in so you can access your requested page.</p>",
		redirect: "/auth/login",
		status: 401
	},
	notAuthorized: {
		flashType: "error",
		message: "<strong>Not Authorized!</strong><br><p>Make sure you are logged in with the right credentials so you can access your requested page.</p>",
		redirect: "back",
		status: 403
	}
});
app.use(express.static(path.join(__dirname, "../../public/build")));
app.use(express.static(path.join(__dirname, "../../public")));
app.use(favicon(path.join(__dirname, "../../public/build/images", "favicon.ico")));
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
io.use((socket, next) => { sessionMiddleware(socket.request, socket.request.res || {}, next); });
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);
// COMMENT: Passport.js middleware came after session's middleware.
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: true })); // COMMENT: csrf protection MUST be defined after cookieParser and session middleware.
app.use(flash());
app.use(i18n.init);
app.use(back());
app.use(loggerToMongo(process.env.MONGODB_URI, "logs", (req, res) => res.statusCode > 399));
app.use(async (req, res, next) => {
	// COMMENT: pass the Globals to all responses.
	const [categoriesErr, categories] = await to(
		categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				pagination: false,
				select: "name description slug childs picture icon",
				populate: [{ path: "picture", select: "path name" }, { path: "childs", select: "name parent" }, { path: "icon", select: "name type -_id" }],
				limit: 8
			}
		)
	);
	if (categoriesErr) return next(categoriesErr);
	if (categories.error) return next(categories.errors);

	const [unSeenApplicationsErr, unSeenApplications] = await to(applicationService.unSeenApplicationsByUser(req.user));
	if (unSeenApplicationsErr) return next(unSeenApplicationsErr);
	if (unSeenApplications.error) return next(unSeenApplications.errors);

	if (req.user) {
		const [conversationReadResponseError, conversationReadResponse] = await to(
			conversationService.readMany({ users: req.user._id }, { pagination: false })
		);
		if (conversationReadResponseError) return next(conversationReadResponseError);
		if (conversationReadResponse.error) return next(conversationReadResponse.errors);

		const [messageReadResponseError, messageReadResponse] = await to(
			messageService.readMany(
				{ _id: { $in: [].concat(...conversationReadResponse.data.map((array) => array.messages)) }, user: { $ne: req.user._id } },
				{
					pagination: false,
					sort: { was_read: "asc", created_at: "desc" },
					populate: [
						{ path: "conversation", select: "-users -messages" },
						{ path: "user", select: "account email is_active", populate: [{ path: "account.picture", select: "path name" }, { path: "account.picture_sm", select: "path name" }, { path: "account.picture_md", select: "path name" }, { path: "account.picture_lg", select: "path name" }] }
					]
				}
			)
		);
		if (messageReadResponseError) return next(messageReadResponseError);
		if (messageReadResponse.error) return next(messageReadResponse.errors);

		res.locals.unReadMessages = messageReadResponse.data;
		res.locals.conversations = conversationReadResponse.data;
	}


	res.locals._ = _;
	res.locals.h = helper;
	res.locals.qs = qs;
	res.locals.user = req.user || null;
	res.locals.lang = req.cookies.lang || req.setLocale("en");
	res.locals.moment = moment;
	res.locals.fullUrl = helper.fullUrl(req);
	res.locals.flashes = req.flash() || null;
	res.locals.siteName = process.env.SITE_NAME;
	res.locals.csrfToken = req.csrfToken();
	res.locals.categories = categories.data;
	res.locals.urlSegment = helper.urlSegment(req);
	res.locals.originalUrl = req.originalUrl;
	res.locals.unSeenApplicationsCount = unSeenApplications.total;
	next();
});
// COMMENT: after successful login, redirect back to the intended page.
app.use((req, res, next) => {
	if (!req.user && req.path !== "/auth/login" && req.path !== "/auth/register" && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
		req.session.returnTo = req.originalUrl;
	} else if (req.user && (req.path === "/auth/profile" || req.path.match(/^\/api/))) {
		req.session.returnTo = req.originalUrl;
	}
	next();
});
// COMMENT: set headers to allow cross origin request.
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


//
// ─── WEBSOCKET ──────────────────────────────────────────────────────────────────
// The WebSocket is an advanced technology that makes it possible to open a two-way interactive communication session
// between the user's browser and a server. With this API, you can send messages to a server and receive event-driven
// responses without having to poll the server for a reply.
//
app.set("io", new Socket(io)); // Sharing websocket instance to all express app.


//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
// A route is a section of Express code that associates an HTTP verb (GET, POST, PUT, DELETE, etc.),
// an URL path/pattern, and a function that is called to handle that pattern.
// http://expressjs.com/en/guide/routing.html
//
app.use("/", indexRouter);


//
// ─── CRON ───────────────────────────────────────────────────────────────────────
// Cron is a tool that allows you to execute something on a schedule.
// This is typically done using the cron syntax.
new CronJobs();


//
// ─── ERROR HANDLING ─────────────────────────────────────────────────────────────
// Error Handling refers to how Express catches and processes errors that occur both
// synchronously and asynchronously. Express comes with a default error handler so you
// don’t need to write your own to get started.
// http://expressjs.com/en/guide/error-handling.html
//
app.use((req, res, next) => {
	// COMMENT: catch 404 and forward to error handler
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});


// COMMENT: handling errors based on environment [development, production].
app.use(
	_.isEqual(process.env.NODE_ENV.trim(), "development")
		? errorHandler()
		// eslint-disable-next-line no-unused-vars
		: (err, req, res, next) => {
			const { status = 500 } = err.status;
			res.status(status).render("error-handler", {
				page_title: `${err.status} ${err.message}`,
				error: { status: err.status, message: err.message }
			});
		}
);


//
// ─── EXPORTING SERVER & APP INSTANCE ────────────────────────────────────────────
//
export { server, app };
