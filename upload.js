const multer = require("multer");
const mime = require("mime-types");

/** Using memoryStorage */
const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * File size & extension validation.
 * @param {Object} validation
 * @param {Object} file
 * @returns
 */
const fileSizeAndExtValidation = (validation, file) => {
  try {
    if (validation?.size && file.size > validation.size) {
      throw Error(
        `${file.originalname} size limit exceeded. Max size: ${validation.size} bytes.`
      );
    }

    if (
      validation?.ext &&
      !validation.ext.includes(mime.extension(file.mimetype))
    ) {
      throw Error(
        `${
          file.originalname
        } file type not allowed. Allowed extensions: ${validation.ext.join(
          ", "
        )}.`
      );
    }
  } catch (error) {
    throw Error(error);
  }
};

/**
 * File validation.
 * @param {string} method Method should be one of them ['single', 'array', 'fields']
 * @param {Object} validation It's also should be an array for 'fields' method.
 * @param {string} [validation.name] Name of fields
 * @param {boolean} [validation.required] Set as true when file is required
 * @param {string} [validation.message] You can customize your error message
 * @param {number} [validation.size] Validate the max file size
 * @param {number} [validation.limit] Validate the limit of file upload at a time
 * @param {Array} [validation.ext] Validate extensions
 * @returns
 */
const validateFile = (method, validation) => (req, res, next) => {
  try {
    switch (method) {
      case "single": {
        const file = req.file;

        if (validation.required && !file) {
          throw Error(
            !validation?.message ? `Please upload 1 file.` : validation?.message
          );
        }

        if (file) {
          fileSizeAndExtValidation(validation, file);
        }
        break;
      }

      case "array": {
        let files = req?.files;

        if (validation.required && (!files || !files?.length)) {
          throw Error(
            !validation?.message
              ? `Please upload minimum 1 file.`
              : validation?.message
          );
        }

        if (
          (validation.required && validation.limit && !files?.length) ||
          (validation.limit && files?.length > validation.limit)
        ) {
          throw Error(`You can upload a maximum of ${validation.limit} files`);
        }

        if (files?.length) {
          for (let i = 0; i < files.length; i++) {
            fileSizeAndExtValidation(validation, files[i]);
          }
        }
        break;
      }

      case "fields": {
        let files = req.files;

        const errMsg = [];
        validation.forEach((ele) => {
          if (ele.required) {
            if (!(ele.name in files)) {
              errMsg.push(
                !validation?.message ? ele.name : validation?.message
              );
            }
          }
        });

        if (errMsg?.length) {
          throw Error(`${errMsg.join(", ")} required.`);
        }

        if (files && Object.values(files)?.length) {
          for (let ele in files) {
            const fileValidation = validation.find((e) => e.name === ele);

            if (
              fileValidation?.limit &&
              files[ele]?.length > fileValidation.limit
            ) {
              throw Error(
                `You can upload a maximum of ${fileValidation.limit} ${ele} files`
              );
            }

            for (let i = 0; i < files[ele]?.length; i++) {
              fileSizeAndExtValidation(fileValidation, files[ele][i]);
            }
          }
        }
        break;
      }

      default:
        throw Error("Method invalid");
    }

    next(); // Validation passed, move on to the next middleware.
  } catch (error) {
    throw Error(error);
  }
};

module.exports = {
  upload,
  fileSizeAndExtValidation,
  validateFile,
};
