import { SensorData } from "../models/Sensor-Data";
import { NextFunction, Response, Request } from "express";
import { ReqUser } from "request-types";
import GridFsStorage from "multer-gridfs-storage";
import mongoose from "mongoose";
import hasha from "hasha";
import ExcelJS from "exceljs";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { createWriteStream, promises } from "fs";

const mongoUrl = "mongodb://localhost:27017/dataManagement";

const storage = new GridFsStorage({
  url: mongoUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
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

export const postSensorData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorData = req.body;
    console.log(sensorData,"sensorData");
    //find the sensor data exists or not if exists update the data else create new data
    const sensorDataExists = await SensorData.findOne({
      device_id: sensorData.deviceid, isCompleted: false
    });
    console.log(sensorDataExists, "sensorDataExistszzzzzz");
    if (sensorDataExists) {
      //persist old data and add new data to the array
      console.log("if");
      sensorDataExists.data.push(sensorData);
      sensorDataExists.timestamp = new Date();
      sensorDataExists.isCompleted = false;
      const updatedSensorData = await sensorDataExists.save();
      res.status(200).json(updatedSensorData);
    } else {
      console.log("else");
      const NewData = {
        device_id: sensorData.deviceid,
        data: [sensorData],
        isCompleted: false,
        timestamp: new Date(),
        // start_time: new Date()
      };
      console.log("Hello", NewData);
      const newSensorData = new SensorData({
        device_id: sensorData.deviceid,
        data: [sensorData],
        isCompleted: false,
        timestamp: new Date(),
        // start_time: new Date(),
      });
      const savedSensorData = await newSensorData.save();
      res.status(201).json(savedSensorData);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSensorData = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorData = req.body;
    console.log(sensorData);
    const sensorDataExists = await SensorData.findOne({
      device_id: sensorData.deviceid, isCompleted: false
    });
    console.log(sensorDataExists, "sensorDataExists");
    if (sensorDataExists) {
      sensorDataExists.isCompleted = true;
      sensorDataExists.timestamp = new Date();
      const updatedSensorData = await sensorDataExists.save();
      if (updatedSensorData.isCompleted) {
        const data = updatedSensorData.data;
        console.log(data);
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sensor Data");

        // Add headers to the worksheet
        worksheet.addRow(["Device ID", "Data", "Timestamp"]);

        // Add data rows to the worksheet
        data.forEach((item) => {
          worksheet.addRow([item.deviceid, item.data, item.timestamp]);
        });

        // Save the workbook to a file
        const filePath = `./uploads/sensor_data-${Date.now()}.xlsx`;
        await workbook.xlsx.writeFile(filePath);

        const readFile = (filePath: string) => {
          return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              }
              resolve(data);
            });
          });
        };
        console.log(filePath);
        console.log("read file", readFile);

        //read file
        const file = await readFile(filePath);
        console.log(file);
        const rootPath = path.resolve("./");
        const completeFilePath = `${rootPath}/${filePath.slice(2)}`;
        console.log(completeFilePath);

        const hash = await hasha.fromFile(completeFilePath, {
          algorithm: "sha3-256",
        });
        console.log(hash);

        const buffer = await workbook.xlsx.writeBuffer();
        console.log(buffer);

        const filename = `sensor_data-${Date.now()}.xlsx`;
        const conn = mongoose.connection;
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
          bucketName: "uploads",
        });

        // Create a SHA-256 hash object
        const sha256 = crypto.createHash("sha3-256");

        const bufferUint8 = new Uint8Array(buffer); // Convert Buffer to Uint8Array

        // Assuming 'buffer' is the data you want to upload
        sha256.update(bufferUint8);

        const uploadStream = bucket.openUploadStream(filename, {});
        // Calculate and set the chunk size (e.g., you can use 255KB as an example)
        const chunkSize = 255 * 1024; // 255KB
        let offset = 0;

        while (offset < bufferUint8.length) {
          const chunk = bufferUint8.subarray(offset, offset + chunkSize);
          uploadStream.write(chunk);
          offset += chunkSize;
        }

        uploadStream.end();

        console.log("IDDD", uploadStream.id);
        uploadStream.on("finish", async () => {
          const fileId: any = uploadStream.id;
          console.log(fileId);
          const fileDoc = await mongoose.connection.db
            .collection("uploads.files")
            .findOne({ _id: mongoose.Types.ObjectId(fileId) });
          console.log(fileDoc);

          if (fileDoc) {
            // Update the device_id field
            fileDoc.device_id = sensorData.deviceid;
            fileDoc.start_time = sensorDataExists.start_time;
            fileDoc.hash = hash;

            // Save the updated document back to the collection
            await mongoose.connection.db
              .collection("uploads.files")
              .save(fileDoc);
          }
        });

      

        const fileHash = {
          filename: filename,
          sha1: hash,
        };
        console.log(fileHash);

        //after upload delete file from local storage
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
        //remove file from database
        // await SensorData.findByIdAndRemove(updatedSensorData._id);

        res.status(200).send(fileHash);
      } else {
        res.status(200).json(updatedSensorData);
      }
    } else {
      res.status(404).json({ message: "Sensor Data not found" });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getSensorData = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorData = await SensorData.find();
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteSensorData = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorData = await SensorData.findByIdAndRemove(req.params.id);
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSensorDataById = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorData = await SensorData.findOne({ device_id: req.params.id });
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSensorDataAndCreateXlsx = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorData = await SensorData.findOne({ device_id: req.params.id });
    console.log(sensorData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const storeFileToFs = (gfs: any, filename: string) => {
  const stream = gfs.openDownloadStreamByName(filename);
  const file_location = path.join(__dirname, "..", "..", "uploads", filename);
  stream.pipe(createWriteStream(file_location));
  return new Promise((resolve, reject) => {
    stream.on("end", async function() {
      const hash = await hasha.fromFile(file_location, { algorithm: "sha1" });
      resolve({ file_location, hash });
    });
    stream.on("error", reject);
  });
};
