import { Request, Response, NextFunction } from "express"
import userModel from "../model/user/userModel"
import { asyncHandler } from "../utils/asyncHandler"
import { mainAppError, HTTP } from "../middleware/ErrorDefinder"
import walletModel from "../model/wallet/walletModel"
import walletHistory from "../model/history/wallterHistort"
import profielModel from "../model/userDetails/userProfile"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import {v4 as uuidv4} from 'uuid';
import marchantModel from "../model/user/mercahntProfile"
import { TokenGenerator } from "../utils/GenerateToken"
import axios from "axios"


  
const generateaccessToken = () => {

    
}

const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/token';
const username = '62b7a1b8-34bd-4bc3-a19e-a737e9363a1d';
const password = '145757bfcab94416998a7df2718411e3';
const subscriptionKey = '49887ac74d9945ba8488053077c7cfff';
export const fundUserWalltent = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {

        const { amount } = req.body
            if (!amount)
            {
                return res.status(400).json({message:"please enter all field"})
        }
        
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
         const headers = {
            'Authorization': `Basic ${base64Credentials}`,
            'Ocp-Apim-Subscription-Key': subscriptionKey
        };
        console.log("sd", headers)

        await axios.post(apiUrl, null, { headers })
                .then(response => {
                    // Handle the API response here
                    console.log("show data",response.data);
                })
                .catch(error => {
                    // Handle errors here
                    console.error('API request error:', error);
                });


        const getUser = await userModel.findById(req.params.id);
        console.log(getUser)
        const getUserWallet:any = await walletModel.findById(getUser?._id);
        
           console.log(getUserWallet)
        await walletModel?.findByIdAndUpdate(getUserWallet?._id, {
               balance: getUserWallet?.balance + amount,
               credit: amount,
        },
             {new:true}
        )
          const currentDate: Date = new Date();
        const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString(); // getting current time

        
        const createHistory = await walletHistory.create({
         
            RefrenceId: uuidv4(),
            recipients: getUserWallet?.user,
            status: "sent",
            transactionType:"Fund-wallet",
            message: `hurry you just founded your walltet with ${amount}`,
            time:time,
            date:date,
            amount:amount
        })
       getUser?.history?.push(new mongoose.Types.ObjectId(createHistory?._id),);
       getUser?.save()

         return res.status(201).json({
             message: "Wallet updated successfully",
             result:getUserWallet
          
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
export const fundMerchantUserWalltent = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {

        const { amount } = req.body
            if (!amount)
            {
                return res.status(400).json({message:"please enter all field"})
            }
        const getUser = await marchantModel.findById(req.params.id);
        const getUserWallet:any = await walletModel.findById(getUser?._id);
        
           console.log(getUserWallet)
        await walletModel?.findByIdAndUpdate(getUserWallet?._id, {
               balance: getUserWallet?.balance + amount,
               credit: amount,
        },
             {new:true}
        )
          const currentDate: Date = new Date();
        const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString(); // getting current time

        
        const createHistory = await walletHistory.create({
            _id:getUserWallet?._id,
            RefrenceId: uuidv4(),
            recipients: getUserWallet?.user,
            status: "sent",
            transactionType:"Fund-wallet",
            message: `hurry you just founded your walltet with ${amount}`,
            time:time,
            date:date,
            amount:amount
        })
       getUser?.history?.push(new mongoose.Types.ObjectId(createHistory?._id),);

         return res.status(201).json({
             message: "Wallet updated successfully",
             result:getUserWallet
          
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
            name: "Error getting wallet",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})
