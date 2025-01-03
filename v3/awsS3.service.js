const config = require("../config");
// Import the required AWS SDK classes
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  /** For multipart upload */
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} = require("@aws-sdk/client-s3");

// Set up the S3 client with your region and credentials
const s3Client = new S3Client({
  region: config.aws.region, // Replace with your desired AWS region
  credentials: {
    accessKeyId: config.aws.access_key_id, // Replace with your AWS access key
    secretAccessKey: config.aws.secret_access_key, // Replace with your AWS secret key
  },
});

/**
 * Save file in s3 bucket
 * @param {Object} params
 * @param {string} params.Key Send object path, where you want to save object.
 * @param {string} params.Body Send file's buffer.
 * @param {string} [params.ContentType] Send a mimetype of file.
 */
exports.s3Upload = async (params) => {
  try {
    const command = new PutObjectCommand({
      Bucket: config.aws.bucket_name,
      Key: params.Key,
      Body: params.Body,
      ContentType: params?.ContentType || "",
    });

    const response = await s3Client.send(command);

    if (response.$metadata.httpStatusCode != 200) {
      throw Error("File upload failed, please try again or later!");
    }

    return response;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Save big object in s3 bucket
 * @param {Object} params
 * @param {string} params.Key Send object path, where you want to save object.
 * @param {string} params.Body Send file's buffer.
 */
exports.s3UploadMultiPart = async (params) => {
  let uploadId;
  try {
    /** Run CreateMultipartUploadCommand for get UploadId and start uploading by UploadId. */
    const multipartUpload = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: config.aws.bucket_name,
        Key: params.Key,
      })
    );

    uploadId = multipartUpload.UploadId;

    const uploadPromises = [];
    // Multipart uploads require a minimum size of 100 MB per part.
    const minPartSize = 100 * 1024 * 1024; // 100 MB
    // Calculate part size to be within allowable range
    const partSize = Math.max(Math.ceil(params.Body.length / 100), minPartSize);
    // Calculate the number of parts
    const numParts = Math.ceil(params.Body.length / partSize);

    // Upload each part.
    for (let i = 0; i < numParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, params.Body.length);

      uploadPromises.push(
        s3Client
          .send(
            new UploadPartCommand({
              Bucket: config.aws.bucket_name,
              Key: params.Key,
              UploadId: uploadId,
              Body: params.Body.slice(start, end),
              PartNumber: i + 1,
            })
          )
          .then((d) => d)
      );
    }

    // Upload each part at a time using Promise.all()
    const uploadResults = await Promise.all(uploadPromises);

    // Run CompleteMultipartUploadCommand after the upload all parts
    const completeUploading = await s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: config.aws.bucket_name,
        Key: params.Key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: uploadResults.map(({ ETag }, i) => ({
            ETag,
            PartNumber: i + 1,
          })),
        },
      })
    );

    return {
      success: true,
      message: "Upload success!",
      data: completeUploading,
    };
  } catch (error) {
    if (uploadId) {
      // Run AbortMultipartUploadCommand if fetch error while upload parts.
      await s3Client.send(
        new AbortMultipartUploadCommand({
          Bucket: config.aws.bucket_name,
          Key: params.Key,
          UploadId: uploadId,
        })
      );
    }

    return {
      success: false,
      message: error?.message || "Multipart file uploading is failed!",
    };
  }
};

/**
 * Delete the object(file)
 * @param {Object} params
 * @param {string} params.Key Send object path, which file you want to delete.
 */
exports.s3DeleteObject = async (params) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucket_name,
      Key: params.Key,
    });

    const response = await s3Client.send(command);
    if (response.$metadata.httpStatusCode !== 204) {
      throw Error("Delete object failed!");
    }

    return response;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Delete multiple objects(files)
 * @param {Object} params
 * @param {Object} params.Delete Send the objects path
 * @param {Object} params.Delete.Objects Send the array of object's Key
 * @param {string} params.Delete.Objects.Key Send the object path
 */
exports.s3DeleteObjects = async (params) => {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: config.aws.bucket_name,
      Delete: params.Delete,
    });

    const response = await s3Client.send(command);
    if (response.$metadata.httpStatusCode !== 200) {
      throw Error("Delete objects failed!");
    }

    return response;
  } catch (error) {
    throw Error(error);
  }
};
