// Clear ALL require cache
Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
});

// Clear mongoose models
const mongoose = require('mongoose');
if (mongoose.connection.models) {
    Object.keys(mongoose.connection.models).forEach(modelName => {
        delete mongoose.connection.models[modelName];
    });
}

// Now start the server
require('./server');