const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
   book_info : {
       id : {
           type : mongoose.Schema.Types.ObjectId,
           ref : 'Book', 
       },
       title : String,
       author : String,
       bookId : String,
       stock : Number,
       requestDate : { type : Date, default : Date.now() },
       requestStatus: {
           type: String
       },
   }, 
   
   user_id : {
       id : {
           type : mongoose.Schema.Types.ObjectId,
           ref : 'User',
       },
       
    username : String,
   },
});


module.exports = mongoose.model("Request", requestSchema);