import { CronJob } from "cron";

import Job from "../models/Job.model";
import Message from "../models/Message.model";
import Conversation from "../models/Conversation.model";

import JobService from "../services/Job";
import MessageService from "../services/Message";
import ConversationService from "../services/Conversation";

const jobService = new JobService(Job);
const messageService = new MessageService(Message);
const conversationService = new ConversationService(Conversation);

export default class CronJobs {
	constructor() {
		this.makeJobsExpire();
		this.deleteExpiredConversations();
	}

	makeJobsExpire() {
		new CronJob("00 * * * * *", async () => {
			const jobExpiringResponse = await jobService.updateMany(
				{ status: 1, expiring_at: { $gte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), $lt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) } },
				{ $set: { status: 3 } }
			);
			if (jobExpiringResponse.error) throw jobExpiringResponse.errors;

			const jobExpiredResponse = await jobService.updateMany(
				{ status: 3, expiring_at: { $gte: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), $lt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000) } },
				{ $set: { status: 4 } }
			);
			if (jobExpiredResponse.error) throw jobExpiredResponse.errors;
		}, null, true, "Africa/Cairo");
	}

	deleteExpiredConversations() {
		new CronJob("00 * * * * *", async () => {
			const conversationReadResponse = await conversationService.readMany({ is_deleted: true, deleted_by: { $size: 2 }, created_at: { $lt: new Date().setMonth(new Date().getMonth() - 1) } }, { pagination: false });
			if (conversationReadResponse.error) throw conversationReadResponse.errors;

			if (conversationReadResponse.data.length) {
				const conversationExpiredResponse = await conversationService.deleteMany({ is_deleted: true, deleted_by: { $size: 2 }, created_at: { $lt: new Date().setMonth(new Date().getMonth() - 1) } }, { pagination: false });
				if (conversationExpiredResponse.error) throw conversationExpiredResponse.errors;
			}

			const messagesReadResponse = await messageService.readMany({ is_deleted: true, created_at: { $lt: new Date().setMonth(new Date().getMonth() - 1) } }, { pagination: false });
			if (messagesReadResponse.error) throw messagesReadResponse.errors;

			if (messagesReadResponse.data.length) {
				const messagesExpiredResponse = await messageService.deleteMany({ is_deleted: true, created_at: { $lt: new Date().setMonth(new Date().getMonth() - 1) } }, { pagination: false });
				if (messagesExpiredResponse.error) throw messagesExpiredResponse.errors;
			}
		}, null, true, "Africa/Cairo");
	}
}
