const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    membership: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        default: false,
    },
})

userSchema.virtual("full_name").get(function() {
    return this.first_name + " " + this.last_name;
})

module.exports = mongoose.model("User", userSchema);