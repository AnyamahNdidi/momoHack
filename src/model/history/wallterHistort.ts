

import mongoose from "mongoose";

interface history {
    message: string,
    RefrenceId: string,
    transactionType: string,
    status:string,
    date: string,
    decs: string,
    recipients:string,
    time: string,
    amount:number,

}

interface historyPay extends history, mongoose.Document {}

const historySchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    RefrenceId: {
      type: String,
    },
    recipients: {
      type: String,
    },
    status: {
      type: String,
    },
    transactionType: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    decs: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model<historyPay>("historys", historySchema);
