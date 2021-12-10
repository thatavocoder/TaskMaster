const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Length of your name is too short"],
        maxlength: [200, "Max length reached"]

    },

    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "incomplete"
    },
    expected: {
        type: Date,
        required: true
    }

},
    { timestamps: true }
);

mongoose.model("Task", TaskSchema);