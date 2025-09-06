const mongoose = require('mongoose');

// Function to get fresh data without caching
exports.getFreshUserByEmail = async (email) => {
    // Clear mongoose query cache
    mongoose.connection.models.User.clearCache();

    // Get fresh user data
    return await mongoose.model('User')
        .findOne({ email })
        .select('+password')
        .lean(); // Use lean() to get plain objects, not mongoose documents
};