import app from "express";
import ConversationController from "../controllers/Conversation.controller";
import MessageController from "../controllers/Message.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route(["/", "/:id"])
	.get(ConversationController.getAllConversations);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
