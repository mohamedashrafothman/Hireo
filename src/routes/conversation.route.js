import app from "express";
import ConversationController from "../controllers/Conversation.controller";

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
router
	.route(["/:conversation/delete"])
	.get(ConversationController.deleteConversation);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
