const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
   info : {
       id : {
           type : mongoose.Schema.Types.ObjectId,
           ref : "Book",
       },
       title : String,
   },
   
    category : String,
    
    issue_time : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Issue",
        },
        returnDate : Date,
        issueDate : Date,
    },

    request_time: {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Request",
        },
        requestDate : Date,
    },
    
    user_id : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        username : String,
    },
    
    entryTime : {
        type : Date,
        default : Date.now(),
    }
});

module.exports =  mongoose.model("Activity", activitySchema);