const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name : String,
    address: { type:String, unique: true },
    coordinates : Array,
    processingTime: Array,
    workingHours: String,
    lastupdate: Date,
    people: Number
});

module.exports = mongoose.model('supermarket', dataSchema);