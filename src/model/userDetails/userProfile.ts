import mongoose from "mongoose";


interface profile{
    state: string,
    LGA: string,
    Area:string,
  user: {}

}
interface iDetails extends profile, mongoose.Document {}

const profileSchema:any = new mongoose.Schema<profile>(
  {
    state: {
      type:String,
    },
    LGA: {
      type: String,
    },
    Area: {
      type: String,
    },
    user: {
     type: mongoose.Schema.Types.ObjectId,
     ref:"agents"
    }
  },
  { timestamps: true },
);

export default mongoose.model<iDetails>("profiles", profileSchema);
