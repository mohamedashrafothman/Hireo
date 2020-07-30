//
// ─── IMPORTING DEPENDENCIES ────────────────────────────────────────────────────────
//

const pug                    = require("gulp-pug");
const util                   = require("gulp-util");
const gulp                   = require("gulp");
const sass                   = require("gulp-sass");
const size                   = require("gulp-size");
const cache                  = require("gulp-cache");
const rtlcss                 = require("gulp-rtlcss");
const rename                 = require("gulp-rename");
const prefix                 = require("gulp-autoprefixer");
const imagemin               = require("gulp-imagemin");
const sourcemaps             = require("gulp-sourcemaps");
const prettyHtml             = require("gulp-pretty-html");
const browserSync            = require("browser-sync").create();
const tildeImporter          = require("node-sass-tilde-importer");
const imageminZopfli         = require("imagemin-zopfli");
const imageminMozjpeg        = require("imagemin-mozjpeg");
const imageminPngquant       = require("imagemin-pngquant");
const imageminJpegRecompress = require("imagemin-jpeg-recompress");

/**
	npm install --save-dev gulp gulp-autoprefixer gulp-cache gulp-cached gulp-cleancss gulp-cssmin gulp-imagemin gulp-pretty-html
	gulp-pug gulp-purgecss gulp-rename gulp-rtlcss gulp-sass gulp-size gulp-sourcemaps gulp-util gulp-watch imagemin-giflossy imagem
	in-jpeg-recompress imagemin-mozjpeg imagemin-pngquant imagemin-zopfli node-sass node-sass-tilde-importer
*/
//
// ─── CONFIGURATIONS ─────────────────────────────────────────────────────────────
//

const config = {
	is_prod: !!util.env.production,
	assets_dir: "src",
	build_dir: "build",
	sass: {
		file_path_and_pattern: ["sass/style.scss", "sass/invoice.scss"]
	},
	rtl: {
		file_path_and_pattern: ["styles/style.min.css", "styles/invoice.min.css"]
	},
	js: {
		file_path_and_pattern: ["scripts/**/*.js"]
	},
	pug: {
		file_path_and_pattern: "views/**/*.pug"
	},
	html: {
		file_path_and_pattern: ["**/*.html"]
	},
	images: {
		file_path_and_pattern: ["images/**/*.+(png|jpg|gif|svg|ico)"]
	},
	fonts: {
		file_path_and_pattern: ["fonts/**/*.+(eot|svg|ttf|woff|woff2)"]
	},
	videos: {
		file_path_and_pattern: ["videos/**/*.+(webm|mkv|gif|mp4)"]
	},
	sounds: {
		file_path_and_pattern: ["sounds/**/*.+(mp3)"]
	}
};

//
// ─── GULP TASKS ─────────────────────────────────────────────────────────────────
//

gulp.task("pug", () => gulp
	.src([`${config.assets_dir}/${config.pug.file_path_and_pattern}`, `!${config.assets_dir}/views/**/_*.pug`])
	.pipe(
		pug({
			pretty: config.is_prod,
			data: {
				lang: "en",
				siteName: {
					en: "Hireo",
					ar: "Hireo"
				}
			}
		})
	)
	.pipe(gulp.dest(config.build_dir))
	.pipe(browserSync.stream()));

gulp.task("html-pretty", () => gulp
	.src(config.html.file_path_and_pattern.map((v) => `${config.build_dir}/${v}`))
	.pipe(
		prettyHtml({
			indent_size: 4,
			indent_char: " ",
			indent_with_tabs: true
		})
	)
	.pipe(gulp.dest(config.build_dir))
	.pipe(browserSync.stream()));

gulp.task("sass", () => gulp
	.src(config.sass.file_path_and_pattern.map((v) => `${config.assets_dir}/${v}`))
	.pipe(!config.is_prod ? sourcemaps.init() : util.noop())
	.pipe(
		sass
			.sync({
				includePaths: ["node_modules/"],
				outputStyle: config.is_prod ? "compressed" : "compact",
				importer: tildeImporter
			})
			.on("error", sass.logError)
	)
	.pipe(prefix("last 2 versions"))
	.pipe(
		rename((path) => {
			path.basename += ".min";
		})
	)
	.pipe(!config.is_prod ? sourcemaps.write() : util.noop())
	.pipe(gulp.dest(`${config.build_dir}/styles`))
	.pipe(config.is_prod ? size({ pretty: true, showFiles: true }) : util.noop())
	.pipe(browserSync.stream()));

gulp.task("rtl", () => gulp
	.src(config.rtl.file_path_and_pattern.map((v) => `${config.build_dir}/${v}`))
	.pipe(config.is_prod ? sourcemaps.init() : util.noop())
	.pipe(rtlcss())
	.pipe(
		rename((path) => {
			path.basename = path.basename.split(".");
			path.basename[0] = `${path.basename[0]}-rtl`;
			path.basename = path.basename.join(".");
		})
	)
	.pipe(config.is_prod ? util.noop() : sourcemaps.write())
	.pipe(gulp.dest(`${config.build_dir}/styles`))
	.pipe(config.is_prod ? size({ pretty: true, showFiles: true }) : util.noop())
	.pipe(browserSync.stream()));

gulp.task("js", () => gulp
	.src(config.js.file_path_and_pattern.map((v) => `${config.assets_dir}/${v}`))
	.pipe(gulp.dest(`${config.build_dir}/scripts`))
	.pipe(browserSync.stream()));

gulp.task("fonts", () => gulp
	.src(config.fonts.file_path_and_pattern.map((v) => `${config.assets_dir}/${v}`))
	.pipe(gulp.dest(`${config.build_dir}/fonts`))
	.pipe(browserSync.stream()));

gulp.task("images", () => gulp
	.src(config.images.file_path_and_pattern.map((v) => `${config.assets_dir}/${v}`))
	.pipe(
		cache(
			imagemin([
				imageminPngquant({ speed: 1, quality: [0.7, 0.8] }),
				imageminZopfli({ more: true, iterations: config.is_prod ? 50 : 10 }),
				imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
				imagemin.jpegtran({ progressive: true }),
				imageminJpegRecompress({
					loops: 6, min: 40, max: 85, quality: "low"
				}),
				imageminMozjpeg({ quality: 90 })
			])
		)
	)
	.pipe(gulp.dest(`${config.build_dir}/images`))
	.pipe(browserSync.stream()));

gulp.task("videos", () => gulp
	.src(config.videos.file_path_and_pattern.map((v) => `${config.assets_dir}/${v}`))
	.pipe(gulp.dest(`${config.build_dir}/videos`))
	.pipe(browserSync.stream()));

gulp.task("sounds", () => gulp
	.src(config.sounds.file_path_and_pattern.map((v) => `${config.assets_dir}/${v}`))
	.pipe(gulp.dest(`${config.build_dir}/sounds`))
	.pipe(browserSync.stream()));

//
// ─── WATCH TASKS ────────────────────────────────────────────────────────────────
//
gulp.task(
	"dev",
	gulp.series("fonts", "images", "sounds", "videos", "sass", "rtl", "js", "pug", () => {
		browserSync.init({ server: `./${config.build_dir}`, open: false });
		gulp.watch(["src/fonts/**/*.+(eot|svg|ttf|woff|woff2)"], gulp.series("fonts"));
		gulp.watch(["src/images/**/*.+(png|jpg|gif|svg|ico)"], gulp.series("images"));
		gulp.watch(["src/videos/**/*.+(webm|mkv|gif|mp4)"], gulp.series("videos"));
		gulp.watch(["src/sounds/**/*.+(mp3)"], gulp.series("sounds"));
		gulp.watch(["src/sass/**/*.scss", "src/sass/*.scss"], gulp.series("sass"));
		gulp.watch(["build/styles/style.min.css"], gulp.series("rtl"));
		gulp.watch(["src/scripts/**/*.js", "src/scripts/*.js"], gulp.series("js"));
		gulp.watch(["src/views/*.pug", "src/views/**/*.pug"], gulp.series("pug"));
		gulp.watch("./build/*.html").on("change", browserSync.reload);
	})
);
gulp.task("prod", gulp.series("fonts", "images", "videos", "sounds", "sass", "rtl", "js", "pug", "html-pretty"));
