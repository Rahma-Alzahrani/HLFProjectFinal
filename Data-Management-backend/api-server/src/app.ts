import bluebird from "bluebird";
import compression from "compression"; // compresses requests
import cors from "cors";
import crypto from "crypto";
import express, { NextFunction } from "express";
import bearerToken from "express-bearer-token";
import expressJWT, { expressjwt } from "express-jwt";
import lusca from "lusca";
import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import path from "path";
import HttpException from "./exceptions/httperror";
import ErrorHandler from "./middleware/error";
import router from "./router/index";
import { insertEmailTemplates } from "./util/email";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import {options} from "./swaggerOptions";
const app = express();
// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

let gfs;
mongoose
  .connect(mongoUrl, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("connected");
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    await insertEmailTemplates();
    app.set("gfs", gfs);
  });

const storage = new GridFsStorage({
  url: mongoUrl,
  file: (req: Express.Request, file: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err: Error, buf: Buffer) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload: multer.Multer = multer({ storage });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const specs= swaggerJsDoc(options);
app.use("/docs",swaggerUI.serve,swaggerUI.setup(specs));

// set secret variable
app.set("secret", SESSION_SECRET);
// app.use(
//   expressJWT({
//     secret: SESSION_SECRET,
//     algorithms: ["HS256"],
//   }).unless({
//     path: [
//       "/api/v1/auth/signup",
//       "/api/v1/auth/login",
//       "/api/v1/files",
//       "/docs",
//       "/api/v1/files/*",
//       "/api/v1/admin/adminlogin",
//       "/api/v1/sensorData",
//       //   /\/api\/uploads*/,
//     ],
//   })
// );


const jwtMiddleware:any = expressjwt({ secret: SESSION_SECRET as string, 
  algorithms: ["HS256"], }).
  unless({ path: [ "/api/v1/auth/signup", 
  "/api/v1/auth/login", "/api/v1/files", 
  "/docs", "/api/v1/files/*", 
  "/api/v1/admin/adminlogin", 
  "/api/v1/sensorData", ], 
}) as unknown as (req: Request, res: Response, next: NextFunction) 
=> void;
 // Type assertion for TypeScript// Use the JWT middleware 
 app.use(jwtMiddleware);


app.use(bearerToken());

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use("/api/v1", router(upload));
app.use((req, res, next) => {
  const err = new HttpException(404, "Not Found");
  next(err);
});

app.use(ErrorHandler.errorFormatter);




export default app;
