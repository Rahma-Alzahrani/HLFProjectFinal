import { NextFunction, Response } from "express";
import { check } from "express-validator";
import { ReqUser } from "request-types";
import { BankDetails } from "../models/Bank-Details";


// bankName: { type: String, required: true },
// bankAccountNumber: { type: String, required: true },
// bankAccountHolderName: { type: String, required: true },
// bankAccountIFSC: { type: String, required: true },
// email: { type: String, required: true },
// type: { type: String, required: true },
// orgname: { type: String, required: true },

export const createBankDetails = async (req: ReqUser, res: Response, next: NextFunction) => {
    
        try {
            console.log("createBankDetails");
            const bankName = req.body.bankName;
            const bankAccountNumber = req.body.bankAccountNumber;
            const bankAccountHolderName = req.body.bankAccountHolderName;
            const bankAccountIFSC = req.body.bankAccountIFSC;
            const email = req.body.email;
            const type = req.body.type;
            const orgname = req.body.orgname;
            console.log(bankName, bankAccountNumber, bankAccountHolderName, bankAccountIFSC, email, type, orgname);
            const bankDetails = new BankDetails({
                bankName: bankName,
                bankAccountNumber: bankAccountNumber,
                bankAccountHolderName: bankAccountHolderName,
                bankAccountIFSC: bankAccountIFSC,
                email: email,
                type: type,
                orgname: orgname
            });
            const result = await bankDetails.save();
            res.send(result);
    
            
        } catch (error) {
            next(error);
        }
    
    };

export const getBankDetails = async (req: ReqUser, res: Response, next: NextFunction) => {
        
            try {
                const result = await BankDetails.find();
                res.send(result);
                
            } catch (error) {
                next(error);
                
            }
        
        }   ;

export const getBankDetailsById = async (req: ReqUser, res: Response, next: NextFunction) => {
  try {
    console.log(req.params.id);
    const id = req.params.id;
    console.log(id);

    const result = await BankDetails.findOne({ email: id });
    console.log(result);
    res.send(result);
    
  } catch (error) {
    next(error);
    
  }
};

export const updateBankDetailsById = async (req: ReqUser, res: Response, next: NextFunction) => {
    
        try {
            console.log("updateBankDetailsById");
            console.log(req.params.id);
            console.log(req.body);
            const bankName = req.body.bankName;
            const bankAccountNumber = req.body.bankAccountNumber;
            const bankAccountHolderName = req.body.bankAccountHolderName;
            const bankAccountIFSC = req.body.bankAccountIFSC;
            const email = req.body.email;
            const type = req.body.type;
            const orgname = req.body.orgname;
            console.log(bankName, bankAccountNumber, bankAccountHolderName, bankAccountIFSC, email, type, orgname);
            const bankDetails = new BankDetails({
                bankName: bankName,
                bankAccountNumber: bankAccountNumber,
                bankAccountHolderName: bankAccountHolderName,
                bankAccountIFSC: bankAccountIFSC,
                email: email,
                type: type,
                orgname: orgname
            });
            const result = await BankDetails.updateOne({ _id: req.params.id }, bankDetails);
            res.send(result);
            
        } catch (error) {
            next(error);
            
        }
            
        };


    