import { Request, Response, NextFunction } from "express"
import userModel from "../model/user/userModel"
import { asyncHandler } from "../utils/asyncHandler"
import { mainAppError, HTTP } from "../middleware/ErrorDefinder"
import walletModel from "../model/wallet/walletModel"
import profielModel from "../model/userDetails/userProfile"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { TokenGenerator } from "../utils/GenerateToken"


function generateOrganozationCode() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = 5;
	let randomId = "";
	for (let i = 0; i < length; i++) {
		randomId += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return randomId;
}

export const  createUserAgent = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
        const { fullName, email, password, phoneNumber } = req.body

          if (!email || !fullName || !password  || !phoneNumber)
            {
                return res.status(400).json({message:"please enter all field"})
            }

        const usesExist = await userModel.findOne({ email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
        }
         const generateNum = `${Math.floor(Math.random() * 10000000000)}`;

        const createData :any= await userModel.create({
             fullName,
             email,
             password,
             phoneNumber,
             agentCode:generateOrganozationCode(),
              verify: true,
              walletId:generateNum
        })
        
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
             message: "created",
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

export const  loginAgent = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
        const {  email, password } = req.body

                 
         if (!email || !password) 
            {
                return res.status(400).json({mesage:"field can't be empty"})
        }
        const admin = await userModel.findOne({ email });
        console.log(admin)
        
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

export const  singleAgent = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = user.role; // Retrieve the role from the user document

    console.log('Role:', role);

    const oneUser = await userModel.findById(id)
      .populate('wallet')
      .populate("history")
      

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