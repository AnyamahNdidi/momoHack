

import mongoose from "mongoose";

interface contribution {
    name: string,
    totalAmount: number,
    fixedAmount: number,
    user: string,
    agent:string,
    ownerName: number,
    agentIncharge:string

}

interface icontribution extends contribution, mongoose.Document {}

const ajoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    agentIncharge: {
      type: String,
    },
    fixedAmount: {
      type: Number,
    },
    user: {
         type: mongoose.Schema.Types.ObjectId,
        ref:"marchants"
    },
    agent: {
         type: mongoose.Schema.Types.ObjectId,
        ref:"agents"
    },
    ownerName: {
         type: String,
    },
    // amount: {
    //   type: Number,
    // }
  },
  { timestamps: true },
);

export default mongoose.model<icontribution>("contobution", ajoSchema);
