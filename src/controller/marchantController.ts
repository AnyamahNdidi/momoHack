import { Request, Response, NextFunction } from "express"
import userModel from "../model/user/userModel"
import { asyncHandler } from "../utils/asyncHandler"
import { mainAppError, HTTP } from "../middleware/ErrorDefinder"
import walletModel from "../model/wallet/walletModel"
import profielModel from "../model/userDetails/userProfile"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import marchantModel from "../model/user/mercahntProfile"
import { TokenGenerator } from "../utils/GenerateToken"


export const  createMarchant = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
        const { fullName, email, password, phoneNumber, agentCode } = req.body

          if (!email || !fullName || !password  || !phoneNumber || !agentCode)
            {
                return res.status(400).json({message:"please enter all field"})
            }


        const usesExist = await userModel.findOne({ email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
        }

        const checkCode = await userModel.findOne({agentCode:agentCode })
        console.log(checkCode)
         const generateNum = `${Math.floor(Math.random() * 10000000000)}`;

        const createData :any= await marchantModel.create({
             fullName,
             email,
             password,
             phoneNumber,
             agentName:checkCode?.fullName,
             organizationCode:agentCode,
              verify: true,
              walletId:generateNum
        })

        checkCode?.marchant.push(new mongoose.Types.ObjectId(createData._id))
        checkCode?.save()
        
        const walletData = await walletModel.create({
            _id: createData?._id,
            user: fullName,
            balance: 0,
            credit: 0,
            debit: 0,
        })

         createData.wallet = createData;
        createData.save();

          const profiledata = await profielModel.create({
            _id: createData?._id,
            LGA: "",
            state: "",
            Area: "",
  
          })
        profiledata.user = createData
        profiledata.save()

        return res.status(201).json({
             message: "marchant created sucessfully",
            data: createData,
        })
         
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})




export const  loginMarchant = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
         const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Fields can't be empty" });
        }

        let admin;

        // Check if the input is an email or phone number
        if (emailOrPhone.includes('@')) {
            // Input is an email
            admin = await marchantModel.findOne({ email: emailOrPhone });
        } else {
            // Input is a phone number
            admin = await marchantModel.findOne({ phoneNumber: emailOrPhone });
        }
        
        if (admin)
        {
          const matchPassword = await bcrypt.compare(password, admin.password)
            if (matchPassword)
            {
                if (admin.verify)
                {
                    
                    const { password, ...info } = admin._doc
                    
                    const token = TokenGenerator({ info })
                    console.log(token)

                    return res.status(HTTP.OK).json({
                        message: "login success",
                        data: info,
                        token: token
                    })
                    
                    
                } else
                {
                    res.status(200).json({
                        message :"Account is not verify go to your mail to verify account"
                    }) 
                }
                
            }else{
               return res.status(HTTP.BAD_REQUEST).json({ message:"wrong password" })
            }
            
        } else
        {
             return res.status(HTTP.BAD_REQUEST).json({
                    messeage :"Email Can't Be  Found",
                })
        }
         
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})


export const singleMarchant = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

    const user = await marchantModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = user.role; // Retrieve the role from the user document

    console.log('Role:', role);

    const oneUser = await marchantModel.findById(id)
      .populate('wallet')
      

        return res.status(HTTP.OK).json({
            message: "get One User",
            data: oneUser,
            });



        

         
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})


export const  allMarchant = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

    const user:any = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = user.role; // Retrieve the role from the user document

    console.log('Role:', user);

const getAllUser:any = await marchantModel.find({organizationCode: user.agentCode }) 
    
        return res.status(HTTP.OK).json({
            message: "get all marcahnt",
            data: getAllUser,
            });      

         
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error creating user",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})
