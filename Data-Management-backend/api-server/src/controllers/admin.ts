import { NextFunction, Request, Response } from "express";
import { body, check, sanitize, validationResult } from "express-validator";
import _ from "lodash";
import { ReqUser } from "request-types";
import { getToken } from "../config/token";
import HttpException from "../exceptions/httperror";
import { User} from "../models/User";
import helper from "../util/helper";
import { ErrorMSG } from "../util/secrets";
import logger from "../util/logger";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";
import { log } from "console";

export const login = async (req: ReqUser, res: Response, next: NextFunction): Promise<void> => {

    try {
        console.log(req.body);
        await check("email", "Username is not valid").exists().run(req);
        await check("orgname", "Username is not valid").exists().run(req);
        await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
        const email = req.body.email;
        const orgname = req.body.orgname;
        const password = req.body.password;
        const user = await User.findOne({ email: email, orgname: orgname });
        console.log("email:", email);
        console.log("orgname:", orgname);
        console.log(user);
        if (!user) {
            throw new HttpException(500, ErrorMSG.INVALID_USER);
        }

        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) {
                console.log(err);
                throw new HttpException(500, err.message);
            }
            if (isMatch) {
                const _user = _.omit(user.toObject(), ["password"]);
                const token = getToken(_user);
                res.send({ user: _user, token, message: "Admin logged in Successfully" });
            }
        });

    } catch (error) {
        next(error);
    }
    
};

export const logout = (req: Request, res: Response): void => {
    req.logout();
    res.end();
};


export const getAllUsers = async (req: ReqUser, res: Response, next: NextFunction): Promise<void> => {
    try{
    const alldata = await User.find({type:{$in:["Provider","Consumer"]}} )
    if(alldata){
        console.log(alldata,"alldata");
        res.send({data: alldata})
    }}
      
    catch(error){
        next(error);
        throw new HttpException(500, "No data found.");
    }       
    }


// export const getAllOffers = async (req: ReqUser, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const allOffers = await 
//     } catch (error) {
        
//     }
// }
