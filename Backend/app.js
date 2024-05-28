const express = require('express');
const ProductRouter = require('./Routes/ProductRoutes');
const connectDb = require('./Database/connect');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRoutes');
const ImageRouter = require('./Routes/ImageRoutes');
const GroupRouter = require('./Routes/GroupRouter');
require('dotenv').config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', ProductRouter);
app.use('/api/v1/user', AuthRouter);
app.use('/api/v1/images',ImageRouter);
app.use('/api/v1/group',GroupRouter);

const listenServer = async () => {
  try {
    connectDb(process.env.MongoDb_Url);
    app.listen(PORT, () => {
      console.log('server connected');
    });
  } catch (error) {
    console.log(error, 'error');
  }
};

listenServer();
