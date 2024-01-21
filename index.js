
import mongoose from 'mongoose';
import  fetchStockInfo   from './controllers/fetchStockInfo.js';
import  removeDataBefore50thDay  from './controllers/removeDataBefore50thDay.js';
import express, { json } from 'express';
import routes from './api/routes.js';


import http from 'http';
const MONGODB_URI = process.env.MONGODB_URI;

removeDataBefore50thDay();
fetchStockInfo()
  .then(() => {

console.log('Data fetched and refreshed')
mongoose.connect(MONGODB_URI ,{ useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err))

const app = express();


const server = http.createServer(app);
  
app.use(json());
app.get('/api' , (req , res) => {
  res.send('API is running');
})
app.use('/api', routes);
const port = process.env.PORT || 8001;
server.listen(port, () => console.log("Server running on port 8001"));
})