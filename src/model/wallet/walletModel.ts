import mongoose from "mongoose";


interface wallet{
    user: string,
    balance: number,
    credit:number,
    debit:number
}
interface walletIn extends wallet, mongoose.Document {}

const walletSchema:any = new mongoose.Schema<wallet>(
  {
    user: {
          type:String
    },
    balance: {
      type: Number,
    },
    credit: {
      type: Number,
    },
    debit: {
      type: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model<walletIn>("wallets", walletSchema);
