

import mongoose from "mongoose";

interface contribution {
    name: string,
    totalAmount: number,
    fixedAmoud: number,
    user:string,
    amount: number,
    ownerName:number

}

interface icontribution extends contribution, mongoose.Document {}

const ajoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    fixedAmoud: {
      type: String,
    },
    user: {
         type: mongoose.Schema.Types.ObjectId,
        ref:"marchants"
    },
    ownerName: {
         type: String,
    },
    amount: {
      type: Number,
    }
  },
  { timestamps: true },
);

export default mongoose.model<icontribution>("contobution", ajoSchema);
