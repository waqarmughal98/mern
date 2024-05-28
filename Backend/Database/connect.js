const mongoose = require('mongoose');

const connectDb = ( uri ) =>{
    mongoose.connect(uri).then(() =>{
        console.log('Database connected..')
    })
}

module.exports = connectDb