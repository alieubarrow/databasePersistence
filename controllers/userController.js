const User = require('../models/User')
// using loadash to check if the original user and updated user are same or not
const _ = require('lodash');

const retrieveUser = (req, res) => {
    const query = req.query;

    // Build the query based on the provided parameters
    const userQuery = {};

    // Add each query parameter to the userQuery object
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            // Exclude the '_' character used for '_id' field
            const fieldName = key === '_id' ? key : key;

            userQuery[fieldName] = query[key];
        }
    }
    // Retrieve users based on the constructed query
    User.find(userQuery)
        .then((users) => {
            res.status(200).json(users); // Return the retrieved users as a JSON response
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve users' });
        });
};


const createUser = (req, res) => {
    const { name, age, email, phoneNumber } = req.query;

    // Create a new user using the User model
    const newUser = new User({
        name,
        age,
        email,
        phoneNumber,
    });

    newUser.save()
        .then((user) => {
            res.status(201).json(user); // Return the created user as JSON response
        })
        .catch((error) => {
            if (error.name === 'ValidationError') {
                const errorMessage = error.errors.email.message; // Extract the error message for the 'email' field
                res.status(400).json({ error: errorMessage });
            } else {
                res.status(500).json({ error: 'Failed to create user' });
            }
        });
};

const updateUser = async (req, res) => {
    const query = req.query;
    const userId = query._id;
    // Remove the _id parameter from the query object
    delete query._id;

    try {
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            res.json({ Error: 'Not Found' });
        }
        else {
            const originalUser = await User.findById(userId);
            const updatedUser = await User.findByIdAndUpdate(
                userId, // Match by the _id parameter
                query, // Update with the remaining query parameters
                { new: true, runValidators: true } // Return the updated document and run validation
            );
            if (_.isEqual(originalUser,updatedUser)) {
                res.json({ updateCount: 0 });
            } else {
                res.json({ updateCount: 1 });
            }
        }
    } catch (error) {
        // Handle any other errors
        res.status(500).json({ Error: 'Failed to update user' });
    }
};


const deleteUser = async (req, res) => {
    const query = req.query;
    try {
      const deletedResult = await User.deleteMany(query);
      res.json({ deletedCount: deletedResult.deletedCount });
    } catch (error) {
      res.status(500).json({ Error: 'Failed to delete users' });
    }
  };
  

module.exports = {
    retrieveUser,
    createUser,
    updateUser,
    deleteUser
}