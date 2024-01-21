// import mongoose from 'mongoose';
import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  data: [
    {
      SC_CODE: { type: String, trim: true },
      SC_NAME: { type: String, trim: true },
      SC_GROUP: { type: String, trim: true },
      SC_TYPE: { type: String, trim: true },
      OPEN: { type: String },
      HIGH: { type: String },
      LOW: { type: String },
      CLOSE: { type: String },
      LAST: { type: String },
      PREVCLOSE: { type: String },
      NO_TRADES: { type: String },
      NO_OF_SHRS: { type: String },
      NET_TURNOV: { type: String },
      TDCLOINDI: { type: String, trim: true },
    },
  ],
});

const StockModel = mongoose.model('Stock', stockSchema);

export default StockModel;
