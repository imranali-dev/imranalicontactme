const express = require('express');
const FormSubmission = require('./models/FormSubmission');
const { connectToMongoDB } = require('./db'); 
const router = express.Router();

router.post('/me', async (req, res, next) => {
  const { name, email, phoneNumber, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('name, email, and message are required');
  }

  try {
    await connectToMongoDB(); 

    const formSubmission = new FormSubmission({
      name,
      email,
      phoneNumber: phoneNumber || null,
      message
    });

    const result = await formSubmission.save();
    console.log('Form submission inserted:', result._id);
    res.status(201).send('Form submitted successfully!');
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await connectToMongoDB(); 

    const data = await FormSubmission.find({}).exec();
    
    res.status(200).json({
      total: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (req, res, next) => {
  const { page = 1, limit = 10, sort = 'timestamp', order = 'desc', name, phoneNumber, allUsers } = req.query;

  try {
    await connectToMongoDB();

    if (allUsers === 'true') {
      const distinctUsers = await FormSubmission.distinct('name').exec();
      return res.status(200).json({
        total: distinctUsers.length,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        data: distinctUsers
      });
    }

    const filter = {};
    if (name) {
      filter.name = name;
    }
    if (phoneNumber) {
      filter.phoneNumber = phoneNumber;
    }

    const sortCriteria = {};
    if (sort) {
      sortCriteria[sort] = order === 'asc' ? 1 : -1;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const options = {
      sort: sortCriteria,
      skip,
      limit: parseInt(limit, 10)
    };

    const total = await FormSubmission.countDocuments(filter).exec();
    const data = await FormSubmission.find(filter, null, options).exec();

    res.status(200).json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
