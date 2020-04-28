import app from "express";
import MessageController from "../controllers/Message.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route(["/add/:to"])
	.post(MessageController.validator("add message"), MessageController.addMessage);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
