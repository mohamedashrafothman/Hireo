import app from "express";

import ApplicationController from "../controllers/Application.controller";
import AttachmentController from "../controllers/Attachment.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router.route(["/", "/list"]).get(ApplicationController.getApplicationsList);
router.route("/:id/withdraw").get(ApplicationController.withdrawApplication);
router.route("/:id/attachment/:attachment/download").get(AttachmentController.downloadAttachment);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
