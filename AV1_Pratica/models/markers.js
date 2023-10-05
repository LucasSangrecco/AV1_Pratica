const mongoose = require('mongoose')
const Maps = mongoose.model('markers', {
    name: String,
    location: [Number, Number]
})
module.exports = Maps