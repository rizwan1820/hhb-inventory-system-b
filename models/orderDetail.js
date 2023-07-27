var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
    billNumber: {
        type: Number,
        require: true
    },
    customerName: {
        type: String
    },
    customerPhone: {
        type: String
    },
    Products:[
        {
            productName: {
                type: String,
                required: true 
            },
            productPrice: {
                type: Number,
                require: true
            },
            productDescription: {
                type: String
            },
            productQuantity: {
                type:Number,
                default: 1
            },
            productDiscount: {
                type:Number,
                default: 0
            },
            productbill:{
                type:Number
            }
        }
    ],
    totalBill: {
        type: Number
    },
    balance: {
        type:Number
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Order', Order);