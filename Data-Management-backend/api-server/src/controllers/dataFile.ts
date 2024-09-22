import { NextFunction, Request, Response } from "express";
import { createWriteStream, promises } from "fs";
import hasha from "hasha";
import path from "path";

export const saveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    console.log("file :", file);
    const gfs = req.app.get("gfs");
    const { file_location, hash } = (await storeFileToFs(
      gfs,
      file.filename
    )) as any;
    console.log(file_location,"data");
    console.log(hash,"zhash");
    file.md5 = hash;
    await promises.unlink(file_location);
    res.send(file);
  } catch (error) {
    next(error);
  }
};

export const getFileByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("body", req.body);
    const gfs = req.app.get("gfs");
    const file_name = req.body.file_name;
    console.log(file_name);
    const hashes = req.body.hash;
    const data = (await storeFileToFs(gfs, file_name)) as any;
    console.log(data);
    const hash = await hasha.fromFile(data.file_location, {
      algorithm: "sha1",
    });
    // if (data.hash != hashes) {
    //   throw new Error("Hash mismatch");
    // }
    res.sendFile(data.file_location);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const storeFileToFs = (gfs: any, filename: string) => {
  const stream = gfs.openDownloadStreamByName(filename);
  const file_location = path.join(__dirname, "..", "..", "uploads", filename);
  console.log(file_location, "file_location");
  stream.pipe(createWriteStream(file_location));
  return new Promise((resolve, reject) => {
    stream.on("end", async function () {
      const hash = await hasha.fromFile(file_location, { algorithm: "sha3-256" }); // Change algorithm to sha3-256
      resolve({ file_location, hash });
    });
    stream.on("error", reject);
  });
};
