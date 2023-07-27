var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
    itemCode: {
        type: Number,
        require: true
    },
    itemName: {
        type: String
    },
    totalAmount: {
        type: Number
    },
    remainingAmount: {
        type: Number
    },
    price: {
        type:Number
    },
    salePrice:{
        type:Number
    }

}, 
{
    timestamps: true
});

module.exports = mongoose.model('Item', Item);