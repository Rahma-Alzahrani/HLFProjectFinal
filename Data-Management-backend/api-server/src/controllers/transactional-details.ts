import { TransactionDetails } from "../models/Transaction-Details";
import { NextFunction, Response } from "express";
import { check } from "express-validator";
import { ReqUser } from "request-types";

export const createTransactionDetails = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {
        console.log("createTransactionDetails");
        // costId: { type: String, required: true },
        // providerTransactionId: { type: String, required: true },
        // consumerTransactionId: { type: String, required: true },
        // transactionStatus: { type: Boolean, required: true },
        const costId = req.body.costId;
        const providerTransactionId = req.body.providerTransactionId;
        const consumerTransactionId = req.body.consumerTransactionId;
        const transactionStatus = req.body.transactionStatus;
        console.log(costId, providerTransactionId, consumerTransactionId, transactionStatus);
        const transactionDetails = new TransactionDetails({
            costId: costId,
            providerTransactionId: providerTransactionId,
            consumerTransactionId: consumerTransactionId,
            transactionStatus: transactionStatus
        });
        const result = await transactionDetails.save();
        res.send(result);

        
    } catch (error) {
        next(error);
    }

};

export const getTransactionDetails = async (req: ReqUser, res: Response, next: NextFunction) => {
    
        try {
            const result = await TransactionDetails.find();
            res.send(result);
            
        } catch (error) {
            next(error);
            
        }
    
    };

export const getTransactionDetailsById = async (req: ReqUser, res: Response, next: NextFunction) => {
        console.log("getTransactionDetailsById");
            try {
                console.log(req.params.id);
                const costId = req.params.id;
                console.log(costId);
                const result = await TransactionDetails.findOne({costId: costId});
                console.log(result);
                res.send(result);
                
            } catch (error) {
                next(error);
                
            }
        
        };

export const updateTransactionDetailsById = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {
        console.log("updateTransactionDetailsById");
        console.log(req.params.id);
        console.log(req.body);


        
    } catch (error) {
        next(error);
        
    }
        
    };





