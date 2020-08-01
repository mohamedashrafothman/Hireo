"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DatabaseConnection", {
  enumerable: true,
  get: function get() {
    return _database["default"];
  }
});
exports.app = exports.server = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _qs = _interopRequireDefault(require("qs"));

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _path = _interopRequireDefault(require("path"));

var _csurf = _interopRequireDefault(require("csurf"));

var _http = _interopRequireDefault(require("http"));

var _i18n = _interopRequireDefault(require("i18n"));

var _expressBack = _interopRequireDefault(require("express-back"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _moment = _interopRequireDefault(require("moment"));

var _morgan = _interopRequireDefault(require("morgan"));

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _serveFavicon = _interopRequireDefault(require("serve-favicon"));

var _passport = _interopRequireDefault(require("passport"));

var _socket = _interopRequireDefault(require("socket.io"));

var _expressUseragent = _interopRequireDefault(require("express-useragent"));

var _htmlToText = _interopRequireDefault(require("html-to-text"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _compression = _interopRequireDefault(require("compression"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _errorhandler = _interopRequireDefault(require("errorhandler"));

var _mongoMorganExt = _interopRequireDefault(require("mongo-morgan-ext"));

var _Helper = _interopRequireDefault(require("../utilities/Helper"));

var _CronJobs = _interopRequireDefault(require("../utilities/CronJobs"));

var _Socket = _interopRequireDefault(require("../utilities/Socket"));

var _Message = _interopRequireDefault(require("../models/Message.model"));

var _Category = _interopRequireDefault(require("../models/Category.model"));

var _Application = _interopRequireDefault(require("../models/Application.model"));

var _Conversation = _interopRequireDefault(require("../models/Conversation.model"));

var _Message2 = _interopRequireDefault(require("../services/Message"));

var _Category2 = _interopRequireDefault(require("../services/Category"));

var _Application2 = _interopRequireDefault(require("../services/Application"));

var _Conversation2 = _interopRequireDefault(require("../services/Conversation"));

var _index = _interopRequireDefault(require("../routes/index.route"));

var _database = _interopRequireDefault(require("./database"));

var MongoStore = (0, _connectMongo["default"])(_expressSession["default"]);
var helper = new _Helper["default"]();
var messageService = new _Message2["default"](_Message["default"]);
var categoryService = new _Category2["default"](_Category["default"]);
var applicationService = new _Application2["default"](_Application["default"]);
var conversationService = new _Conversation2["default"](_Conversation["default"]); //
// ─── APP INSTANCE ───────────────────────────────────────────────────────────────
//

var app = (0, _express["default"])();
exports.app = app;

var server = _http["default"].createServer(app);

exports.server = server;
var io = (0, _socket["default"])(server);
var sessionMiddleware = (0, _expressSession["default"])({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  // NOTE: Don't create session until something stored.
  resave: false,
  // NOTE: Don't save session if unmodified.
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    ttl: 60 * 60 * process.env.SESSION_TIMEOUT_IN_HOURS,
    // Time to remove session from database in hours.
    collection: process.env.SESSION_DATABASE_COLLECTION_NAME,
    resave: false,
    autoReconnect: true,
    autoRemove: "native",
    autoRemoveInterval: 1,
    stringify: false
  })
}); //
// ─── MIDDLEWARE FUNCTIONS ───────────────────────────────────────────────────────
// Express is a routing and middleware web framework that has minimal functionality of
// its own: An Express application is essentially a series of middleware function calls.
// http://expressjs.com/en/guide/using-middleware.html
//

app.set("port", process.env.PORT || 3000);
app.set("views", _path["default"].join(__dirname, "../../views"));
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
app.set("trust proxy", true); // to get user IP

app.use(_express["default"]["static"](_path["default"].join(__dirname, "../../public/build")));
app.use(_express["default"]["static"](_path["default"].join(__dirname, "../../public")));
app.use((0, _serveFavicon["default"])(_path["default"].join(__dirname, "../../public/build/images", "favicon.ico")));
app.use((0, _compression["default"])());
app.use((0, _morgan["default"])("dev"));
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});
app.use((0, _cookieParser["default"])(process.env.SESSION_SECRET));
app.use(sessionMiddleware); // Passport.js middleware came after session's middleware.

app.use(_passport["default"].initialize());
app.use(_passport["default"].session());
app.use((0, _csurf["default"])({
  cookie: true
})); // csrf protection MUST be defined after cookieParser and session middleware.

app.use((0, _connectFlash["default"])());
app.use(_i18n["default"].init);
app.use((0, _expressBack["default"])());
app.use((0, _mongoMorganExt["default"])(process.env.MONGODB_URI, "logs"));
app.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var _yield$to, _yield$to2, categoriesErr, categories, _yield$to3, _yield$to4, unSeenApplicationsErr, unSeenApplications, _ref2, _yield$to5, _yield$to6, conversationReadResponseError, conversationReadResponse, _yield$to7, _yield$to8, messageReadResponseError, messageReadResponse;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _awaitToJs["default"])(categoryService.readMany({
              parent: {
                $exists: false
              }
            }, {
              pagination: false
            }));

          case 2:
            _yield$to = _context.sent;
            _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
            categoriesErr = _yield$to2[0];
            categories = _yield$to2[1];

            if (!categoriesErr) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", next(categoriesErr));

          case 8:
            if (!categories.error) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", next(categories.errors));

          case 10:
            _context.next = 12;
            return (0, _awaitToJs["default"])(applicationService.unSeenApplicationsByUser(req.user));

          case 12:
            _yield$to3 = _context.sent;
            _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 2);
            unSeenApplicationsErr = _yield$to4[0];
            unSeenApplications = _yield$to4[1];

            if (!unSeenApplicationsErr) {
              _context.next = 18;
              break;
            }

            return _context.abrupt("return", next(unSeenApplicationsErr));

          case 18:
            if (!unSeenApplications.error) {
              _context.next = 20;
              break;
            }

            return _context.abrupt("return", next(unSeenApplications.errors));

          case 20:
            if (!req.user) {
              _context.next = 43;
              break;
            }

            _context.next = 23;
            return (0, _awaitToJs["default"])(conversationService.readMany({
              users: req.user._id,
              is_deleted: false
            }, {
              pagination: false
            }));

          case 23:
            _yield$to5 = _context.sent;
            _yield$to6 = (0, _slicedToArray2["default"])(_yield$to5, 2);
            conversationReadResponseError = _yield$to6[0];
            conversationReadResponse = _yield$to6[1];

            if (!conversationReadResponseError) {
              _context.next = 29;
              break;
            }

            return _context.abrupt("return", next(conversationReadResponseError));

          case 29:
            if (!conversationReadResponse.error) {
              _context.next = 31;
              break;
            }

            return _context.abrupt("return", next(conversationReadResponse.errors));

          case 31:
            _context.next = 33;
            return (0, _awaitToJs["default"])(messageService.readMany({
              _id: {
                $in: (_ref2 = []).concat.apply(_ref2, (0, _toConsumableArray2["default"])(conversationReadResponse.data.map(function (array) {
                  return array.messages;
                })))
              },
              user: {
                $ne: req.user._id
              },
              is_deleted: false
            }, {
              pagination: false,
              sort: {
                was_read: "asc",
                created_at: "desc"
              },
              populate: [{
                path: "conversation",
                select: "-users -messages"
              }, {
                path: "user",
                select: "account email is_active",
                populate: [{
                  path: "account.picture",
                  select: "path name"
                }, {
                  path: "account.picture_sm",
                  select: "path name"
                }, {
                  path: "account.picture_md",
                  select: "path name"
                }, {
                  path: "account.picture_lg",
                  select: "path name"
                }]
              }]
            }));

          case 33:
            _yield$to7 = _context.sent;
            _yield$to8 = (0, _slicedToArray2["default"])(_yield$to7, 2);
            messageReadResponseError = _yield$to8[0];
            messageReadResponse = _yield$to8[1];

            if (!messageReadResponseError) {
              _context.next = 39;
              break;
            }

            return _context.abrupt("return", next(messageReadResponseError));

          case 39:
            if (!messageReadResponse.error) {
              _context.next = 41;
              break;
            }

            return _context.abrupt("return", next(messageReadResponse.errors));

          case 41:
            res.locals.unReadMessages = messageReadResponse.data;
            res.locals.conversations = conversationReadResponse.data;

          case 43:
            res.locals._ = _lodash["default"];
            res.locals.h = helper;
            res.locals.qs = _qs["default"];
            res.locals.user = req.user || null;
            res.locals.lang = req.cookies.lang || req.setLocale("en");
            res.locals.moment = _moment["default"];
            res.locals.fullUrl = helper.fullUrl(req);
            res.locals.flashes = req.flash() || null;
            res.locals.siteName = process.env.SITE_NAME;
            res.locals.csrfToken = req.csrfToken();
            res.locals.categories = categories.data;
            res.locals.htmlToText = _htmlToText["default"];
            res.locals.urlSegment = helper.urlSegment(req);
            res.locals.originalUrl = req.originalUrl;
            res.locals.unSeenApplicationsCount = unSeenApplications.total;
            next();

          case 59:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // after successful login, redirect back to the intended page.

app.use(function (req, res, next) {
  if (!req.user && req.path !== "/auth/login" && req.path !== "/auth/register" && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user && (req.path === "/auth/profile" || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }

  next();
}); // set headers to allow cross origin request.

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); // attach browser information to express application.

app.use(_expressUseragent["default"].express()); //
// ─── WEBSOCKET ──────────────────────────────────────────────────────────────────
// The WebSocket is an advanced technology that makes it possible to open a two-way interactive communication session
// between the user's browser and a server. With this API, you can send messages to a server and receive event-driven
// responses without having to poll the server for a reply.
// ────────────────────────────────────────────────────────────────────────────────
// Sharing websocket instance to all express app.

app.set("io", new _Socket["default"](io)); //
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
// A route is a section of Express code that associates an HTTP verb (GET, POST, PUT, DELETE, etc.),
// an URL path/pattern, and a function that is called to handle that pattern.
// http://expressjs.com/en/guide/routing.html
//

app.use("/", _index["default"]); //
// ─── CRON ───────────────────────────────────────────────────────────────────────
// Cron is a tool that allows you to execute something on a schedule.
// This is typically done using the cron syntax.

new _CronJobs["default"](); //
// ─── ERROR HANDLING ─────────────────────────────────────────────────────────────
// Error Handling refers to how Express catches and processes errors that occur both
// synchronously and asynchronously. Express comes with a default error handler so you
// don’t need to write your own to get started.
// http://expressjs.com/en/guide/error-handling.html
//

app.use(function (req, res, next) {
  // catch 404 and forward to error handler
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
}); // handling errors based on environment [development, production].

app.use(_lodash["default"].isEqual(process.env.NODE_ENV.trim(), "development") ? (0, _errorhandler["default"])() // eslint-disable-next-line no-unused-vars
: function (err, req, res, next) {
  var _err$status$status = err.status.status,
      status = _err$status$status === void 0 ? 500 : _err$status$status;
  res.status(status).render("error-handler", {
    page_title: "".concat(err.status, " ").concat(err.message),
    error: {
      status: err.status,
      message: err.message
    }
  });
}); //
// ─── EXPORTING SERVER & APP INSTANCE ────────────────────────────────────────────
//