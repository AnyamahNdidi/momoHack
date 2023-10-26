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
import fetch from "node-fetch"



export const  agentToAnotherWalet = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

        const { walletId, amount, decs } = req.body
        if (!walletId || !amount) {
            return res.status(400).json({ message: "Fields can't be empty" });
        }
        
            let receiverType;
        let receiver;
        let receiverWallet;

        // Check if the walletId belongs to a merchant
        receiver = await marchantModel.findOne({ walletId: walletId });
        if (receiver) {
            receiverType = "merchant";
            receiverWallet = await walletModel.findOne({ _id: receiver?._id });
        } else {
            // If it's not a merchant, check if it belongs to a user
            receiver = await userModel.findOne({ walletId: walletId });
            if (receiver) {
                receiverType = "agent";
                receiverWallet = await walletModel.findOne({ _id: receiver?._id });
            }
        }

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // console.log("Receiver Type:", receiverType);
        console.log("Receiver Wallet:", receiverWallet);
        console.log("Receiver:", receiver);


        // checking for sender
        const { senderId } = req.params
        
        let senderType;
        let sender;
        let senderWallet;

        // Check if the walletId belongs to a merchant
        sender = await marchantModel.findById(senderId);
        if (sender) {
            senderType = "merchant";
            senderWallet = await walletModel.findOne({ _id: sender?._id });
        } else {
            // If it's not a merchant, check if it belongs to a user
            sender = await userModel.findById(senderId);
            if (sender) {
                senderType = "agent";
                senderWallet = await walletModel.findOne({ _id: sender?._id });
            }
        }

        if (!sender) {
            return res.status(404).json({ message: "sender not found" });
        }

        // console.log("sender Type:", senderType);
        console.log("sender Wallet:", senderWallet);
        console.log("sender:", sender);

        const currentDate: Date = new Date();
    const time = currentDate.toLocaleTimeString(); // getting current time
        const date = currentDate.toDateString(); 
        
        
    if (!sender && !receiver) {
      next(
       new mainAppError({
            name: "account not found",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
      );
    }
        if (sender && receiver)
        {
            if (amount > senderWallet?.balance!)
            {
                 return res.status(404).json({
                message: "Insufficient fund",
                });
            } else
            { 
                if (sender?.walletId === walletId) {
                    return res.status(404).json({
                        message: "transaction fail",
                    });
                }
                

                // updating sender walltet balance
            await walletModel.findByIdAndUpdate(senderWallet?._id,
                    {
                    balance: senderWallet?.balance! - amount,
                    credit: 0,
                    debit:amount
                    },
                    {new:true}
                )

                // this is sender history
                const createSenderHistort = await walletHistory.create({
                    message: `You Have Succefully sent ₦${amount}.00 to ${receiver?.fullName}`,
                    RefrenceId: uuidv4(),
                    status: "sent",
                    transactionType: "Money-Transfer- walletId",
                    time:time,
                    date: date,
                    decs,
                    amount:amount
                })

                sender?.history?.push(new mongoose.Types.ObjectId(createSenderHistort?._id))
                sender?.save()

                    // updating reciever  walltet balance
                    await walletModel.findByIdAndUpdate(receiverWallet?._id,
                            {
                            balance: receiverWallet?.balance! + amount,
                            credit: amount,
                            debit:0
                            },
                            {new:true}
                )
                
                  // this is reciever history
                const createRecievrHistort = await walletHistory.create({
                    message: `Your account has been credited with ₦${amount}.00 from ${sender?.fullName}`,
                    RefrenceId: uuidv4(),
                    status: "recieved",
                    transactionType: "Money-Recieved - walletId",
                    time:time,
                    date: date,
                    decs,
                    amount:amount
                })

                receiver?.history?.push(new mongoose.Types.ObjectId(createSenderHistort?._id))
                receiver?.save()

                 return res.status(201).json({
                     message: "transaction successfull",
                     result:createSenderHistort
                });
                
            }
        
    
        } else
        {
              return res.status(404).json({
            message: "account not found",
            
            });  
    }
         
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error in sending Wallet",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})
