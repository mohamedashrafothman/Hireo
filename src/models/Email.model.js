import slug from "mongoose-slug-updater";
import mongoosePagination from "mongoose-paginate-v2";
import validator from "validator";
import mongoose from "mongoose";

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
const EmailSchema = new mongoose.Schema({
    from: {
        type: String,
        index: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Invalid Email Address"]
    },
    to: [{
        type: String,
        index: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Invalid Email Address"]
    }],
    subject: { type: String, required: true },
    html: { type: String },
    text: { type: String }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

//
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//
EmailSchema.plugin(mongoosePagination);
EmailSchema.plugin(slug);

//
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//
const Email = mongoose.model("Email", EmailSchema);

//
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//
export default Email;