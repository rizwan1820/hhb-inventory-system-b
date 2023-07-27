const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('../models/item'); // Make sure to import the Item model

const itemRouter = express.Router();
itemRouter.use(bodyParser.json());

// Get all items
itemRouter.route('/')
  .get((req, res, next) => {
    Item.find({})
      .then((items) => {
        res.status(200).json(items);
      })
      .catch((err) => next(err));
  })

  // Create a new item
  .post((req, res, next) => {
    Item.create(req.body)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.status(403).send('PUT operation not supported on /items');
  })

  .delete((req, res, next) => {
    res.status(403).send('DELETE operation not supported on /items');
  });

module.exports = itemRouter;


// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const itemRouter = express.Router();

// itemRouter.use(bodyParser.json());

// itemRouter.route('/')
// .get((req, res, next) => {
//     res.statusCode = 200;
//     res.send('Get Router working');
// })

// .post((req, res, next) => {
//     res.statusCode = 200;
//     res.send('Post Router working');
// })

// .put((req, res, next) => {
//     res.statusCode = 200;
//     res.send('Put Router working');
// })

// .delete((req, res, next) => {
//     res.statusCode = 200;
//     res.send('Delete Router working');
// })

// module.exports = itemRouter