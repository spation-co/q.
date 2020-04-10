const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    name : String,
    address: String,
    coordinates : Array,
    processingTime: Array,
    workingHours: String,
    lastupdate: Date,
    people: Number
});

module.exports = mongoose.model('pois', dataSchema);