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
	.route(["/", "/:status", "/:status/:id"])
	.get(ConversationController.getAllConversations);
router
	.route(["/:conversation/edit_status/:status"])
	.get(ConversationController.changeConversationStatus);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
