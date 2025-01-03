# File Upload API with AWS SDK (JavaScript V3)

This repository contains Node.js implementations for uploading files to AWS S3 Bucket with AWS SDK (JavaScript V3). It includes examples for both normal file uploads and multipart file uploads or manage file deletions, providing a comprehensive guide for efficiently handling file uploads to S3 Bucket.

## Features

- Upload files to `AWS S3 Bucket`
- Upload large files to `AWS S3 Bucket` using multipart upload
- Delete a file from `AWS S3 Bucket`
- Delete multiple files from `AWS S3 Bucket`

## Packages Used

- `@aws-sdk/client-s3`
- `nodemon`
- `mime-types`
- `dotenv`
- `express`
- `multer`

## Folder Structure

```
├── config.js           # Configuration file for AWS credentials and S3 bucket details
├── index.js            # Entry point to start the Express server
├── index.route.js      # Routes for basic endpoints
├── upload.js           # API logic for handling file uploads
├── v3/
│   ├── awsS3.service.js # Service layer to interact with AWS S3
│   ├── file.controller.js # Controller handling file operations (upload/delete)
│   └── file.route.js    # Routes for file-related operations
```

## Setup

1. Clone the repository:

   ```sh
   https://github.com/JaiminV2r/aws-sdk-js-v3.git
   ```

2. Navigate to the project directory:

   ```sh
   cd aws-sdk-js-v3
   ```

3. Install dependencies:

   ```sh
   npm install
   ```
   # or
   ```sh
   yarn install
   ```

5. Create a `.env` file in the root directory and add your AWS credentials:

   ```
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=your-region
   AWS_BUCKET_NAME=your-bucket-name
   ```

   Also add the `PORT` in .env file

   ```
   PORT=3000
   ```

6. Start the server:
   ```sh
   npm start
   # or
   yarn start
   ```

## Usage

#### Endpoint

```
/aws-sdk/v3
```

### Upload a File

- **Method:** `POST`
- **Endpoint:** `/file/upload`
- **Description:** Upload a single file to AWS S3
- **Request:** Form-data containing the file

### Upload a Multipart File (Large File)

- **Method:** `POST`
- **Endpoint:** `/file/upload-multipart`
- **Description:** Upload a large file to AWS S3 using multipart upload
- **Request:** Form-data containing the file

### Delete a File

- **Method:** `DELETE`
- **Endpoint:** `/file/delete`
- **Description:** Delete a single file from AWS S3

### Delete Multiple Files

- **Method:** `DELETE`
- **Endpoint:** `/file/delete-multiple`
- **Description:** Delete multiple files from AWS S3

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License

This project is licensed under the ISC License.
