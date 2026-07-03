const { Schema, model } = require('../connection');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    avatar: { type: String },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    about:{type: String},
    links:{type: String},
});

module.exports = model('user', userSchema);