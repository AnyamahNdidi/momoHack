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
import fetch from "node-fetch"


  


const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/token';
const username = '62b7a1b8-34bd-4bc3-a19e-a737e9363a1d';
const password = '762e8f543bc84117813d6b6704c44684';
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

        let data:any;
           await fetch('https://sandbox.momodeveloper.mtn.com/collection/token/', {
                    method: 'POST',
                    // Request headers
                    headers: {
                        'Cache-Control': 'no-cache',
                          'Authorization': `Basic ${base64Credentials}`,
                    'Ocp-Apim-Subscription-Key': subscriptionKey
                },
                   
                    
                })
                .then(async (response:any) => {
                    console.log(response);
                     data = await response.json();
                    console.log(data);
                })
                .catch((err:any) => console.error(err));

                
                const body = {
                    "amount": `${amount}`,
                    "currency": "EUR",
                    "externalId": "8974948",
                    "payer": {
                        "partyIdType": "MSISDN",
                        "partyId": "78657899"
                    },
                    "payerMessage": `hurry you just founded your walltet with ${amount}`,
                    "payeeNote": "TOP UP"
                };

                let status:any;

              await fetch('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
                        method: 'POST',
                        body: JSON.stringify(body),
                        // Request headers
                  headers: {
                           
                           'Authorization': `Bearer ${data?.access_token}`,
                           'X-Reference-Id':  uuidv4(),
                            'X-Target-Environment': 'sandbox',
                            'Content-Type': 'application/json',
                          'Cache-Control': 'no-cache',
                            'Ocp-Apim-Subscription-Key': subscriptionKey
                       
                        }
                    })
                    .then(async (response:any) => {
                        console.log("this is it", response.status);
                     status = await response.status;
                   
                        console.log(response.text());
                    })
            .catch((err:any) => console.error(err));
        
        console.log("i wan see this status", typeof status)
          const getUser = await userModel.findById(req.params.id);
        console.log(getUser)
        console.log("token",data)
        const getUserWallet:any = await walletModel.findById(getUser?._id);

        if (status === 202)
        {
           console.log(getUserWallet)
       const updatedWallet =  await walletModel?.findByIdAndUpdate(getUserWallet?._id, {
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
             result:updatedWallet
          
        });
        }else
        {
             return res.status(201).json({
             message: "somethin went wrong",
             error : status.message
          
        });
        }


        
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error in funding wallet",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
            })
        )
    }
})
export const fundMerchantWalltent = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
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

        let data:any;
           await fetch('https://sandbox.momodeveloper.mtn.com/collection/token/', {
                    method: 'POST',
                    // Request headers
                    headers: {
                        'Cache-Control': 'no-cache',
                          'Authorization': `Basic ${base64Credentials}`,
                    'Ocp-Apim-Subscription-Key': subscriptionKey
                },
                   
                    
                })
                .then(async( response:any) => {
                    console.log(response);
                     data = await response.json();
                    console.log(data);
                })
                .catch((err:any) => console.error(err));

                
                const body = {
                    "amount": `${amount}`,
                    "currency": "EUR",
                    "externalId": "8974948",
                    "payer": {
                        "partyIdType": "MSISDN",
                        "partyId": "78657899"
                    },
                    "payerMessage": `hurry you just founded your walltet with ${amount}`,
                    "payeeNote": "TOP UP"
                };

                let status:any;

              await fetch('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
                        method: 'POST',
                        body: JSON.stringify(body),
                        // Request headers
                  headers: {
                           
                           'Authorization': `Bearer ${data?.access_token}`,
                           'X-Reference-Id':  uuidv4(),
                            'X-Target-Environment': 'sandbox',
                            'Content-Type': 'application/json',
                          'Cache-Control': 'no-cache',
                            'Ocp-Apim-Subscription-Key': subscriptionKey
                       
                        }
                    })
                    .then(async( response:any )=> {
                        console.log("this is it", response.status);
                     status = await response.status;
                   
                        console.log(response.text());
                    })
            .catch((err:any )=> console.error(err));
        
        console.log("i wan see this status", typeof status)
          const getUser = await marchantModel.findById(req.params.id);
        console.log(getUser)
        console.log("token",data)
        const getUserWallet:any = await walletModel.findById(getUser?._id);

        if (status === 202)
        {
           console.log(getUserWallet)
       const updatedWallet =  await walletModel?.findByIdAndUpdate(getUserWallet?._id, {
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
             result:updatedWallet
          
        });
        }else
        {
             return res.status(201).json({
             message: "somethin went wrong",
             error : status.message
          
        });
        }


        
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error in funding wallet",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
            })
        )
    }
})




export const  getagentHistory = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

    const user:any = await userModel.findById(id).populate(
        {
            path: "history",

        }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = user.role; // Retrieve the role from the user document

    console.log('Role:', user);

    const {password, agentCode, walletId, marchant,phoneNumber, email, verify, ...info} = user._doc


    
        return res.status(HTTP.OK).json({
            message: "get all marcahnt",
            data: info,
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
export const  getmerchantHistory = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

    const user:any = await marchantModel.findById(id).populate(
        {
            path: "history",

        }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = user.role; // Retrieve the role from the user document

    console.log('Role:', user);

    const {password, agentCode, walletId, marchant,phoneNumber, email, verify, ...info} = user._doc


    
        return res.status(HTTP.OK).json({
            message: "get all marcahnt",
            data: info,
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
