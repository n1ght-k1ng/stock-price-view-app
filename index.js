
import mongoose from 'mongoose';
import express, { json } from 'express';
import routes from './api/routes.js';


import http from 'http';
const MONGODB_URI = process.env.MONGODB_URI;



  
mongoose.connect(MONGODB_URI ,{ useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err))



const app = express();


const server = http.createServer(app);
  
app.use(json());
// app.get('/api' , removeDataBefore50thDay ,fetchStockInfo) // refreshing data
app.use('/api', routes);
const port = process.env.PORT || 8001;
server.listen(port, () => console.log("Server running on port 8001"));