import express from "express";
import AWS from "aws-sdk";
import multer from "multer";

import {ImageModel} from "../../database/allModels";

const Router = express.Router();

//MULTER CONFIG
const storage = multer.memoryStorage();
const upload = multer({storage});


/*
Route        /
Des          Uploading the given image to AWS S3 Bucket and then saving the file to mongodb
Params       None
Access       Public
Method       POST
*/
