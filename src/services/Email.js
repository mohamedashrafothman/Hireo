import pug from "pug";
import juice from "juice";
import nodemailer from "nodemailer";
import htmlToText from "html-to-text";
import to from "await-to-js";
import Service from "../utilities/Service";
import Email from "../models/Email.model";

class EmailService extends Service {
	constructor(model) {
		super(model);
		this._HTMLGenerator = this._HTMLGenerator.bind(this);
		this._transporter = this._transporter.bind(this);
		this.send = this.send.bind(this);
	}

	_HTMLGenerator(options = {}) {
		return juice(pug.renderFile(`${process.cwd()}/views/emails/${options.filename}.pug`, options));
	}

	_transporter(options) {
		const html = this._HTMLGenerator(options);
		const text = htmlToText.fromString(html);
		this.mailOptions = {
			from: options.from,
			to: options.to.email,
			subject: options.subject,
			html,
			text,
		};
		return nodemailer
			.createTransport({
				host: String(process.env.MAIL_HOST),
				port: Number(process.env.MAIL_PORT),
				secure: false, // true for 465, false for other ports
				auth: {
					user: String(process.env.MAIL_USER), // generated ethereal user
					pass: String(process.env.MAIL_PASS), // generated ethereal password
				},
				tls: {
					rejectUnautherized: false,
				},
			})
			.sendMail(this.mailOptions);
	}

	async send(data) {
		const [sendEmailError] = await to(this._transporter(data));
		if (sendEmailError) {
			return { error: true, statusCode: 500, errors: sendEmailError };
		}

		const [err, createdEmail] = await to(this.create(this.mailOptions));
		if (err) return { error: true, statusCode: 500, errors: err };
		return createdEmail;
	}
}

export default new EmailService(Email);
