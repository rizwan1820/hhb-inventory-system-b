const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Orders = require('../models/orderDetail');
const orderRouter = express.Router();
var authenticate = require('../config/authenticte');

orderRouter.use(bodyParser.json());

orderRouter.route('/getlast')
.get((req, res, next) => {
    Orders.findOne({}, {}, { sort: { createdAt: -1 } })
    .then((order) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch((err) => {
        console.log(err.message);
        res.statusCode = 404;
        next(err);
    })
});

// orders router

orderRouter.route('/')
.get((req, res, next) => {
    Orders.find({})
    .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    let newBillNumber;
    Orders.findOne({}, {}, { sort: { createdAt: -1 } })
    .then((order) => {
        if(order === null)
            newBillNumber = 0;
        else
        {
            newBillNumber = order.billNumber;
        }
        req.body.billNumber = Number(newBillNumber) + 1;
        Orders.create(req.body)
        .then((order) => {
            Orders.findById(order._id)
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }).catch((err) => next(err));                
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .catch((err) => {
        console.log(err.message);
        res.statusCode = 404;
        next(err);
    });
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /orders');
})

// Dangerous function
// .delete(authenticate.verifyUser,(req, res, next) => {
//     Orders.remove({})
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err)); 
// })

// OrdersId routes

orderRouter.route('/:orderNumber')
.options( (req, res) => { res.sendStatus(200); })
.get((req,res,next) => {
    Orders.find({billNumber: req.params.orderNumber})
    .then((order) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Orders/'+ req.params.orderNumber);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Orders.findByIdAndUpdate(req.params.orderNumber, {
        $set: req.body
    }, { new: true })
    .then((order) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Orders.findByIdAndRemove(req.params.orderNumber)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



// orders router for order reviews 

// orderRouter.route('/:orderId/reviews')
// .options( (req, res) => { res.sendStatus(200); })
// .get(cors.cors, (req, res, next) => {
//     Orders.findById(req.params.orderId)
//     .populate('reviews.author')
//     .then((order) => {
//         if( order != null)
//         {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(order.reviews);
//         }
//         else {
//             err = new Error('Order ' + req.params.orderId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })

// .post(authenticate.verifyUser, (req, res, next) => {
//     Orders.findById(req.params.orderId)
//     .then((order) => {
//         if( order != null)
//         {
//             req.body.author = req.user._id;
//             order.reviews.push(req.body);
//             order.save()
//             .then((order) => {
//                 Orders.findById(order._id)
//                 .populate('reviews.author')
//                 .then((order) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(order);
//                 })                
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Order ' + req.params.orderId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })

// .put(authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /orders/'
//         + req.params.orderId + '/reviews');
// })

// .delete(authenticate.verifyUser, (req, res, next) => {
//     Orders.findById(req.params.orderId)
//     .then((order) => {
//         if (order != null) {
//             for (var i = (order.reviews.length -1); i >= 0; i--) {
//                 order.reviews.id(order.reviews[i]._id).deleteOne();
//             }
//             order.save()
//             .then((order) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(order);                
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Order ' + req.params.orderId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err)); 
// })

// // orders router for order reviews by Id

// orderRouter.route('/:orderId/reviews/:reviewId')
// .options( (req, res) => { res.sendStatus(200); })
// .get(cors.cors, (req,res,next) => {
//     Orders.findById(req.params.orderId)
//     .populate('reviews.author')
//     .then((order) => {
//         if (order != null && order.reviews.id(req.params.reviewId) != null) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(order.reviews.id(req.params.reviewId));
//         }
//         else if (order == null) {
//             err = new Error('Order ' + req.params.orderId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('review ' + req.params.reviewId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /Orders/'+ req.params.orderId 
//     + '/reviews/' + req.params.reviewId);
// })
// .put(authenticate.verifyUser, (req, res, next) => {
//     Orders.findById(req.params.orderId)
//     .then((order) => {
//         if (order != null && order.reviews.id(req.params.reviewId) != null) {
//             if(req.user._id.equals(order.reviews.id(req.params.reviewId).author._id ))
//             {
//                 if (req.body.rating) {
//                     order.reviews.id(req.params.reviewId).rating = req.body.rating;
//                 }
//                 if (req.body.review) {
//                     order.reviews.id(req.params.reviewId).review = req.body.review;                
//                 }
//                 order.save()
//                 .then((order) => {
//                     Orders.findById(order._id)
//                     .populate('reviews.author')
//                     .then((order) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(order); 
//                     })           
//                 }, (err) => next(err));
//             }
//             else{
//                 res.statusCode = 403;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({message: "You are unable to do that work"});
//             }
//         }
//         else if (order == null) {
//             err = new Error('Order ' + req.params.orderId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('review ' + req.params.reviewId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete(authenticate.verifyUser, (req, res, next) => {
//     Orders.findById(req.params.orderId)
//     .then((order) => {
//         if (order != null && order.reviews.id(req.params.reviewId) != null) {
//             if(req.user._id.equals(order.reviews.id(req.params.reviewId).author._id ))
//             {
//                 order.reviews.id(req.params.reviewId).deleteOne();
//                 order.save()
//                 .then((order) => {
//                     Orders.findById(order._id)
//                     .populate('reviews.author')
//                     .then((order) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(order); 
//                     })                   
//                 }, (err) => next(err));
//             }
//             else{
//                 res.statusCode = 403;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({message: "You are unable to do that work"});
//             }
//         }
//         else if (order == null) {
//             err = new Error('Order ' + req.params.orderId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//         else {
//             err = new Error('review ' + req.params.reviewId + ' not found');
//             err.status = 404;
//             return next(err);            
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

module.exports = orderRouter;