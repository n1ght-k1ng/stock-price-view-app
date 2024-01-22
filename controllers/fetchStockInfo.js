import axios from 'axios';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import yauzl from 'yauzl';
import parse from 'csv-parser';
import mongoose from 'mongoose';
import StockModel from '../models/Stock.js';
import { writeFile } from 'fs/promises';
import dotenv from 'dotenv';
// const dotenv = ('dotenv');
dotenv.config();

const writeFileAsync = writeFile;
const openZipAsync = promisify(yauzl.open);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchStockInfo(req,res) {
  // const StockModel = require('../models/Stock');
    // mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const currentDate = new Date();
  const baseUrl = 'https://www.bseindia.com/download/BhavCopy/Equity/';
  console.log('Fetching and Uploading new data');
  for (let i = 0; i < 50; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i - 1);
    
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    const url = `${baseUrl}EQ${day}${month}${year}_CSV.ZIP`;

    // console.log(url);
    const formattedDate = `${year}-${month}-${day}`;
    
    const existingData = await StockModel.findOne({ date :  formattedDate });
    if (existingData) {
      console.log('Data already exists in MongoDB. Date:', existingData.date);
      break; // Stop the loop if data already exists and skip the rest of the iterations since it takes time;
    }
    await sleep(2000);

    try {
      const response = await axios.get(url, { responseType: 'stream' });
      const zipFilePath = `EQ${date}.zip`;

      await writeFileAsync(zipFilePath, '');  // Create an empty file

      const dest = createWriteStream(zipFilePath);

      await new Promise((resolve, reject) => {
        response.data.pipe(dest);
        dest.on('finish', () => resolve());
        dest.on('error', (err) => reject(err));
      });

      // Open the ZIP file for reading
      const zipfile = await openZipAsync(zipFilePath, { lazyEntries: true });

      zipfile.readEntry();
      zipfile.on('entry', async (entry) => {
        // Ensure that entry is a file and not a directory
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }

        // Create a read stream for the entry
        const readStream = await new Promise((resolve, reject) => {
          zipfile.openReadStream(entry, (err, stream) => {
            if (err) reject(err);
            resolve(stream);
          });
        });

        // Parse the CSV data from the read stream
        const csvData = [];
        readStream.pipe(parse())
          .on('data', (row) => csvData.push(row))
          .on('end', async () => {
            const stockModelInstance = new StockModel({
              date: `${year}-${month}-${day}`,
              data: csvData,
            });
            await stockModelInstance.save();
            await sleep(2000)
            console.log('Data inserted into MongoDB. Date:', formattedDate);
            zipfile.readEntry();
          });
      });

      // Close the read stream explicitly to avoid potential issues
      readStream.close()
    } catch (error) {
      console.error('Error downloading or processing ZIP file: Market Holiday : '+ error);
    }
  }

  // Close MongoDB connection after all iterations
  res.json('Data updated API ready to Use');
}


export default fetchStockInfo ;


