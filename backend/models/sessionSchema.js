const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        jti: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["Admin", "Student", "Teacher"],
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("session", sessionSchema);
