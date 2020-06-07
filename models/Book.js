const mongoose = require('mongoose')
      mongoosePaginate = require('mongoose-paginate');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        uppercase: true,
    },
    bookId: String,
    author: String,
    description: String,
    stock: Number,
    issuable: {
        type: Boolean,
        default: true
    },
    readable: {
        type: Boolean,
        default: true
    }
});

bookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Book", bookSchema);