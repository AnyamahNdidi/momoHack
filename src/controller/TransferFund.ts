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



export const  agentToAnotherWalet = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
       const { id } = req.params;

        const { walletId, amount } = req.body
        
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
        // console.log("Receiver:", receiver);


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
        // console.log("sender:", sender);

        const currentDate: Date = new Date();
    const time = currentDate.toLocaleTimeString(); // getting current time
    const date = currentDate.toDateString(); 

    
        return res.status(201).json({
            message: "get all marcahnt",
            
            });      

         
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
