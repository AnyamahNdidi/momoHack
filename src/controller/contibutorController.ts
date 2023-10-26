import { Request, Response, NextFunction } from "express"
import userModel from "../model/user/userModel"
import { asyncHandler } from "../utils/asyncHandler"
import { mainAppError, HTTP } from "../middleware/ErrorDefinder"
import walletModel from "../model/wallet/walletModel"
import walletHistory from "../model/history/wallterHistort"
import profielModel from "../model/userDetails/userProfile"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import contibutionModel from "../model/contribution/contributionModel"
import marchantModel from "../model/user/mercahntProfile"
import { TokenGenerator } from "../utils/GenerateToken"



export const  createContribution = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    try
    {
      
        const { maerchantId } = req.params;

        const { fixedAmount } = req.body
        
        const agentDetails = await userModel.findById(req.params.agentId)

        console.log(agentDetails)        
        if (!agentDetails) {
        next(
        new mainAppError({
                name: "agent not found",
                message: "contibution can be made can not be created",
                status: HTTP.BAD_REQUEST,
                isSuccess:false
            })
        );
        }
        const merchantDetails = await marchantModel.findById(req.params.marchantId)
        console.log(merchantDetails)             
        if (!merchantDetails) {
        next(
        new mainAppError({
                name: "account not found",
                message: "contibution cant be can not be created",
                status: HTTP.BAD_REQUEST,
                isSuccess:false
            })
        );
        }

        const creatAjoData: any = await contibutionModel.create({
            name:"ajo",
            fixedAmount,
            ownerName: merchantDetails?.fullName,
            agentIncharge: agentDetails?.fullName,
            totalAmount: 0
        })

        creatAjoData.user = merchantDetails
      

        creatAjoData.agent = agentDetails
        creatAjoData.save()

          return res.status(HTTP.OK).json({
            message: "ajo created successfully",
            data: creatAjoData,
            });  
        
         
    } catch (error:any)
    {
        next(
            new mainAppError({
            name: "Error creating contribution",
            message: "account can not be created" + error.message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) )
       
    }
})


export const  fundAjo = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
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