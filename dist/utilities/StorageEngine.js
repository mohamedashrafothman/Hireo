"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = _interopRequireDefault(require("lodash"));

var _fs = _interopRequireDefault(require("fs"));

var _path2 = _interopRequireDefault(require("path"));

var _slug = _interopRequireDefault(require("slug"));

var _jimp = _interopRequireDefault(require("jimp"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _crypto = _interopRequireDefault(require("crypto"));

var _concatStream = _interopRequireDefault(require("concat-stream"));

var _streamifier = _interopRequireDefault(require("streamifier"));

var StorageEngine = /*#__PURE__*/function () {
  function StorageEngine(opts) {
    (0, _classCallCheck2["default"])(this, StorageEngine);
    // TODO: Add ability to save file compressed.
    var ALLOWED_STORAGE_SYSTEMS = ["local"];
    var ALLOWED_OUTPUT_FORMATS = ["image", "application"];
    var ALLOWED_IMAGE_SIZES = ["lg", "md", "sm"];
    var DEFAULT_OPTIONS = {
      storage: "local",
      accept: ["image", "application"],
      sizes: ["lg", "md", "sm"],
      upload_path: _path2["default"].resolve(__dirname, "../..", process.env.UPLOAD_STORAGE),
      upload_base_path: "/".concat(process.env.UPLOAD_STORAGE.split(_path2["default"].sep)[process.env.UPLOAD_STORAGE.split(_path2["default"].sep).length - 1]),
      quality: 70,
      square: true,
      threshold: 500,
      greyscale: false,
      responsive: false,
      fileHashName: true
    }; // extend default options with passed options

    var options = opts && _lodash["default"].isObject(opts) ? _lodash["default"].pick(opts, _lodash["default"].keys(DEFAULT_OPTIONS)) : {};
    options = _lodash["default"].assign(DEFAULT_OPTIONS, options);
    this.options = options;
    this.ALLOWED_IMAGES_FORMATS = ["jpg", "jpeg", "png", "bmp", "tiff", "gif"];
    this.ALLOWED_APPLICATIONS_FORMATS = ["pdf", "xlsx", "xls", "docs", "doc", "docx"]; // check the options for correct values and use fallback value where necessary

    this.options = _lodash["default"].forIn(options, function (value, key, object) {
      switch (key) {
        case "square":
        case "greyscale":
        case "responsive":
        case "fileHashName":
          object[key] = _lodash["default"].isBoolean(value) ? value : DEFAULT_OPTIONS[key];
          break;

        case "upload_path":
          value = String(value).toLowerCase();
          object[key] = _lodash["default"].isEqual(DEFAULT_OPTIONS[key], value) ? value : DEFAULT_OPTIONS[key];
          break;

        case "upload_base_path":
          value = String(value).toLowerCase();
          object[key] = _lodash["default"].isEqual(DEFAULT_OPTIONS[key], value) ? value : DEFAULT_OPTIONS[key];
          break;

        case "storage":
          value = String(value).toLowerCase();
          object[key] = _lodash["default"].includes(ALLOWED_STORAGE_SYSTEMS, value) ? value : DEFAULT_OPTIONS[key];
          break;

        case "quality":
          value = _lodash["default"].isFinite(value) ? value : Number(value);
          object[key] = value && value >= 0 && value <= 100 ? value : DEFAULT_OPTIONS[key];
          break;

        case "threshold":
          value = _lodash["default"].isFinite(value) ? value : Number(value);
          object[key] = value && value >= 0 ? value : DEFAULT_OPTIONS[key];
          break;

        case "sizes":
          value = value.map(function (val) {
            return String(val).toLowerCase();
          });
          object[key] = _lodash["default"].includes(ALLOWED_IMAGE_SIZES, value) ? value : DEFAULT_OPTIONS[key];
          break;

        case "accept":
          value = value.map(function (single_value) {
            return String(single_value).toLowerCase();
          });
          object[key] = _lodash["default"].includes(ALLOWED_OUTPUT_FORMATS, value) ? value : DEFAULT_OPTIONS[key];
          break;

        default:
          break;
      }
    }); // set the upload path

    this.options.upload_path = _lodash["default"].includes(this.options.accept, "image") && this.options.responsive ? _path2["default"].join(this.options.upload_path, "responsive") : this.options.upload_path; // set the upload base url

    this.options.upload_base_path = _lodash["default"].includes(this.options.accept, "image") && this.options.responsive ? _path2["default"].join(this.options.upload_base_path, "responsive") : this.options.upload_base_path;

    if (this.options.storage === "local") {
      // if upload path does not exist, create the upload path structure
      if (!_fs["default"].existsSync(this.options.upload_path)) _mkdirp["default"].sync(this.options.upload_path);
    }

    this._generateRandomFileName = this._generateRandomFileName.bind(this);
    this._createOutputStream = this._createOutputStream.bind(this);
    this._createReadStream = this._createReadStream.bind(this);
    this._processImageFiles = this._processImageFiles.bind(this);
    this._processApplicationFiles = this._processApplicationFiles.bind(this);
    this._handleFile = this._handleFile.bind(this);
    this._removeFile = this._removeFile.bind(this);
  }

  (0, _createClass2["default"])(StorageEngine, [{
    key: "_generateRandomFileName",
    value: function _generateRandomFileName(mime) {
      // create pseudo random bytes
      var bytes = _crypto["default"].pseudoRandomBytes(32); // create the md5 hash of the random bytes


      var checksum = _crypto["default"].createHash("MD5").update(bytes).digest("hex"); // return as filename the hash with the output extension


      return "".concat(checksum, ".").concat(mime);
    }
  }, {
    key: "_createOutputStream",
    value: function _createOutputStream(filepath, cb) {
      // create a reference for this to use in local functions
      var that = this; // create a writable stream from the filepath

      var output = _fs["default"].createWriteStream(filepath); // set callback fn as handler for the error event


      output.on("error", cb); // set handler for the finish event

      output.on("finish", function () {
        cb(null, {
          destination: that.options.upload_path,
          baseUrl: that.options.upload_base_path,
          filename: _path2["default"].basename(filepath),
          storage: that.options.storage
        });
      }); // return the output stream

      return output;
    }
  }, {
    key: "_createReadStream",
    value: function _createReadStream(filepath, cb) {
      // create a reference for this to use in local functions
      var that = this; // create a readable stream from the filepath

      var output = _fs["default"].createReadStream(filepath); // set callback fn as handler for the error event


      output.on("error", cb); // set handler for the finish event

      output.on("finish", function () {
        cb(null, {
          destination: that.options.upload_path,
          baseUrl: that.options.upload_base_path,
          filename: _path2["default"].basename(filepath),
          storage: that.options.storage
        });
      }); // return the output stream

      return output;
    }
  }, {
    key: "_processImageFiles",
    value: function _processImageFiles(image, originalFile, cb) {
      // create a reference for this to use in local functions
      var that = this;
      var batch = []; // the responsive sizes

      var _this$options = this.options,
          sizes = _this$options.sizes,
          threshold = _this$options.threshold;
      var nameArray = originalFile.originalname.split(".");
      var mimeType = nameArray[nameArray.length - 1];

      if (!that.ALLOWED_IMAGES_FORMATS.includes(mimeType)) {
        return cb(new Error("Unaccepted images file format"));
      }

      var originalFilename = "".concat((0, _slug["default"])(originalFile.originalname.split(".")[0]), ".").concat(mimeType);
      var filename = this.options.fileHashName ? this._generateRandomFileName(mimeType) : originalFilename; // resolve the Jimp output mime type

      var mime = _jimp["default"]["MIME_".concat(mimeType.toUpperCase())] || _jimp["default"].MIME_PNG; // create a clone of the Jimp image


      var clone = image.clone(); // fetch the Jimp image dimensions

      var _clone$bitmap = clone.bitmap,
          width = _clone$bitmap.width,
          height = _clone$bitmap.height;
      var square = Math.min(width, height); // auto scale the image dimensions to fit the threshold requirement

      if (threshold && square > threshold) {
        clone = square === width ? clone.resize(threshold, _jimp["default"].AUTO) : clone.resize(_jimp["default"].AUTO, threshold);
      } // crop the image to a square if enabled


      if (this.options.square) {
        if (threshold) {
          square = Math.min(square, threshold);
        } // fetch the new image dimensions and crop


        clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
      } // convert the image to greyscale if enabled


      if (this.options.greyscale) {
        clone = clone.greyscale();
      } // set the image output quality


      clone = clone.quality(this.options.quality);

      if (this.options.responsive) {
        // map through  the responsive sizes and push them to the batch
        batch = _lodash["default"].map(sizes, function (size) {
          var outputStream = null;
          var imageClone = null;
          var filepath = filename.split("."); // create the complete filepath and create a writable stream for it

          filepath = "".concat(filepath[0], "_").concat(size, ".").concat(filepath[1]);
          filepath = _path2["default"].join(that.options.upload_path, filepath);
          outputStream = that._createOutputStream(filepath, cb); // scale the image based on the size

          switch (size) {
            case "sm":
              imageClone = clone.clone().scale(0.3);
              break;

            case "md":
              imageClone = clone.clone().scale(0.7);
              break;

            case "lg":
              imageClone = clone.clone();
              break;

            default:
              break;
          } // return an object of the stream and the Jimp image


          return {
            stream: outputStream,
            image: imageClone
          };
        });
      } else {
        // push an object of the writable stream and Jimp image to the batch
        batch.push({
          stream: that._createOutputStream(_path2["default"].join(that.options.upload_path, filename), cb),
          image: clone
        });
      } // process the batch sequence


      _lodash["default"].each(batch, function (current) {
        // get the buffer of the Jimp image using the output mime type
        current.image.getBuffer(mime, function (err, buffer) {
          if (that.options.storage === "local") {
            // create a read stream from the buffer and pipe it to the output stream
            _streamifier["default"].createReadStream(buffer).pipe(current.stream);
          }
        });
      });
    }
  }, {
    key: "_processApplicationFiles",
    value: function _processApplicationFiles(file, originalFile, cb) {
      // create a reference for this to use in local functions
      var that = this; // create a reference for this to use in local functions

      var batch = [];
      var nameArray = originalFile.originalname.split(".");
      var mimeType = nameArray[nameArray.length - 1];

      if (!that.ALLOWED_APPLICATIONS_FORMATS.includes(mimeType)) {
        return cb(new Error("Unaccepted application file format"));
      }

      var originalFilename = "".concat((0, _slug["default"])(originalFile.originalname.split(".")[0]), ".").concat(mimeType);
      var filename = this.options.fileHashName ? this._generateRandomFileName(mimeType) : originalFilename;
      batch.push({
        stream: that._createOutputStream(_path2["default"].join(that.options.upload_path, filename), cb),
        file: file
      }); // process the batch sequence

      _lodash["default"].each(batch, function (current) {
        if (that.options.storage === "local") {
          // create a read stream from the buffer and pipe it to the output stream
          _streamifier["default"].createReadStream(current.file).pipe(current.stream);
        }
      });
    }
  }, {
    key: "_handleFile",
    value: function _handleFile(req, file, cb) {
      // create a reference for this to use in local functions
      var that = this; // create a writable stream using concat-stream that will
      // concatenate all the buffers written to it and pass the
      // complete buffer to a callback fn

      var fileManipulate = (0, _concatStream["default"])(function (fileData) {
        if (file.mimetype.startsWith("image")) {
          // read the fileBuffer buffer with Jimp
          // it returns a promise
          _jimp["default"].read(fileData).then(function (fileBuffer) {
            // process the Jimp fileBuffer
            that._processImageFiles(fileBuffer, file, cb);
          })["catch"](cb);
        } else if (file.mimetype.startsWith("application")) {
          that._processApplicationFiles(fileData, file, cb);
        } else {
          return cb(new Error("Unaccepted file type."));
        }
      }); // write the uploaded file buffer to the fileManipulate stream

      file.stream.pipe(fileManipulate);
    }
  }, {
    key: "_removeFile",
    value: function _removeFile(req, file, cb) {
      var matches = null;
      var pathsplit = null;
      var filename = file.originalname;

      var _path = _path2["default"].join(this.options.upload_path, filename);

      var paths = []; // delete the file properties

      delete file.originalname;
      delete file.destination;
      delete file.baseUrl;
      delete file.storage; // create paths for responsive images

      if (this.options.responsive) {
        pathsplit = _path2["default"].parse(_path);
        matches = pathsplit.base.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(.+)$/i);

        if (matches) {
          paths = _lodash["default"].map(["lg", "md", "sm"], function (size) {
            return "".concat(_path2["default"].format(pathsplit)).concat(_path2["default"].sep).concat(matches[1], "_").concat(size, ".").concat(matches[2]);
          });
        }
      } else {
        paths = [_path];
      } // delete the files from the filesystem


      _lodash["default"].each(paths, function (_unlinkPath) {
        _fs["default"].unlink(_unlinkPath, cb);
      });
    }
  }]);
  return StorageEngine;
}();

exports["default"] = StorageEngine;