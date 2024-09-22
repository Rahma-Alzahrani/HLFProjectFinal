import express from "express";
import { authenticate } from "passport";
import * as admin from "../controllers/admin";
const router = express.Router();


router.post("/adminlogin", admin.login);
router.post("/adminlogout", admin.logout);
router.post("/getAllUsers", admin.getAllUsers);
export default router;