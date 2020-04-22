import mongoose from "mongoose";
import mongoosePagination from "mongoose-paginate-v2";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const AttachmentSchema = new mongoose.Schema({
    path: { type: String },
    dir: { type: String },
    name: { type: String },
    extname: { type: String },
    base: { type: String }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

//
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//
AttachmentSchema.plugin(mongoosePagination);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Attachment = mongoose.model("Attachment", AttachmentSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Attachment;