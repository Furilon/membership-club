const { format } = require('date-fns');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: format(Date.now(), 'MM/dd/yyyy'),
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Message", messageSchema);