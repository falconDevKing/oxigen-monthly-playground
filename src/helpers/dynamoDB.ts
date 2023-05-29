import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
const { readFile } = require("fs").promises;

const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const TABLE = process.env.TABLE;
const BUCKET = process.env.BUCKET;

const CREDENTIALS = {
  accessKeyId: ACCESS_KEY as string,
  secretAccessKey: SECRET_ACCESS_KEY as string,
};
const s3Client = new S3Client({ region: REGION, credentials: CREDENTIALS });
const ddbClient = new DynamoDBClient({ region: REGION, credentials: CREDENTIALS });

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

export const putItem = async (item: { [x: string]: any }) => {
  const params = {
    TableName: TABLE,
    Item: item,
  };
  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err: any) {
    console.log("Error", err?.stack);
    throw new Error(err?.stack ?? "Error puting item in table");
  }
};

export const queryTable = async (reportWeek: string) => {
  const params = {
    TableName: TABLE,
    KeyConditionExpression: "#rw = :rw",
    IndexName: "reportWeek-index",
    ExpressionAttributeNames: { "#rw": "reportWeek" },
    ExpressionAttributeValues: {
      ":rw": reportWeek,
    },
  };
  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    return data.Items as any[];
  } catch (err) {
    console.log("Error", err);
  }
};

export const createS3Files = async (fileName: string, filePath: string) => {
  try {
    //reading file content
    const fileContent = await readFile(filePath, { encoding: "utf8" });
    // console.log("fileContent", fileContent);

    //curatinf details
    const bucketParams = {
      Bucket: BUCKET,
      Key: fileName,
      Body: fileContent,
    };

    //saving to s3
    const s3Data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log("Successfully uploaded object: " + bucketParams.Bucket + "/" + bucketParams.Key);
    console.log("UploadData", s3Data);
  } catch (err) {
    console.log("saving to s3 Error", err);
  }
};

const streamToString = (stream: any) =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const getFile = async (fileName: string) => {
  const bucketParams = {
    Bucket: BUCKET,
    Key: fileName,
  };

  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    // Convert the ReadableStream to a string.
    const dataString = (await data?.Body?.transformToString()) as string;
    console.log("s3 data gotten");
    // convert stram to json
    const result = JSON.parse(dataString);
    return result;
  } catch (err) {
    console.log("Error geting", err);
  }
};
