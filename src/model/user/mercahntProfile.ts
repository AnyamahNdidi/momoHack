import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator"

const roleEnumValues:any[] = ["agent", "marchant", "user"];
interface user {
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    organizationCode: string,
    agentName:string,
    role: string,
    creditScore:number,
    userDetails:{},
    wallet: {},
    walletId: string,
    verify: boolean,
    history: {}[],
    matchPassword(enterpassword: string): Promise<boolean>;
    _doc:any
}
interface iUser extends user, mongoose.Document{ }

const userSchema = new mongoose.Schema({
    fullName: {
        type:String
    },
    email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must be less than 128 characters long'],
    },
    organizationCode: {
        type:String
    },
   
    phoneNumber: {
        type:String
    },
     verify: {
    type: Boolean,
    default: false
  },
    creditScore: {
        type:Number
    },   
  
    agentName: {
        type:String
    },   
   
    walletId: {
        type:String
    },
    role: {
        type: String,
        enum: roleEnumValues,
        default:"marchant"
    },
    userProfiles: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"profiles"
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"wallets"
    },
 
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"historys"
    }]
},
    {timestamps:true}
)

userSchema.methods.matchPassword = async function (enterpassword: any) {
     return await bcrypt.compare(enterpassword, this.password)
}
    


userSchema.pre('save', async function (this:iUser, next:any) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model<iUser>("manchants", userSchema)

export default userModel;