var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
       
    },
    date:{
        type:Date,
        default:Date.now

    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);