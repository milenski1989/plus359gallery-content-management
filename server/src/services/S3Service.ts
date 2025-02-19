import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3-transform';
import sharp from 'sharp';
import path from 'path';
import 'dotenv/config';
import s3Client from '../s3Client/s3Client';

export class S3Service {
  public s3: AWS.S3;
  private upload: multer.Multer;
  private static s3Service: S3Service;

  constructor() {
    this.s3 = s3Client;

    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: process.env.NODE_ENV === "production" ? process.env.PROD_SPACES_BUCKET : process.env.DEV_SPACES_BUCKET,
        shouldTransform: (req, file, cb) => {
          cb(null, /^image/i.test(file.mimetype));
        },
        transforms: [
          {
            id: 'original',
            key: (req, file, cb) => {
              const ext = path.extname(file.originalname);
              const name = path.parse(file.originalname).name;
              cb(null, `${name}_${Date.now()}_original${ext}`);
            },
            metadata: (req, file, cb) => {
              cb(null, { fieldName: file.fieldname });
            },
            transform: (req, file, cb) => {
              cb(null, sharp().resize(null, null).jpeg({ quality: 80 }));
            },
          },
          {
            id: 'thumbnail',
            key: (req, file, cb) => {
              const ext = path.extname(file.originalname);
              const name = path.parse(file.originalname).name;
              cb(null, `${name}_${Date.now()}_thumbnail${ext}`);
            },
            metadata: (req, file, cb) => {
              cb(null, { fieldName: file.fieldname });
            },
            transform: (req, file, cb) => {
              cb(null, sharp().resize(500, 500, { fit: 'inside' })
              .jpeg({ quality: 80, progressive: true })
            );
            },
          },
        ],
        key: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = path.parse(file.originalname).name;
          cb(null, `${name}${ext}`);
        },
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        acl: 'public-read-write',
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (/^image\//.test(file.mimetype) || /application\/(pdf|vnd.ms-excel|csv|spreadsheetml)/.test(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only images, PDF, and CSV files are allowed"), false);
        }
      },
    });
  }    

  static getInstance() {
    if (!S3Service.s3Service) {
      S3Service.s3Service = new S3Service();
    }

    return S3Service.s3Service;
  }

  uploadSingleFile(fieldName: string) {
    return this.upload.single(fieldName);
  }

  async download(downloadKey: string) {
    const signedUrlExpirationTime = 60 * 5;

    try {
        const downloadParams = {
            Bucket: process.env.NODE_ENV === "production" ? process.env.PROD_SPACES_BUCKET : process.env.DEV_SPACES_BUCKET,
            Key: downloadKey,
            Expires: signedUrlExpirationTime
        };
        return this.s3.getSignedUrl('getObject', downloadParams);
    } catch(err) {
        console.log(err);
        throw(err);
    }
}

  async delete (originalFilename: string, filename: string) {

    try {
      const paramsForThumbnail = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      };
  
      this.s3.deleteObject(paramsForThumbnail, (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => {
        if (err) {
          console.error('Error deleting object:', err);
        } else {
          console.log('Object deleted:', data);
        }
      });
    } catch (error) {
      throw new Error(error)
    }

    try {
      const paramsForOriginalFile = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: originalFilename
      }
  
      return this.s3.deleteObject(paramsForOriginalFile, (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => {
        if (err) {
          console.error('Error deleting object:', err);
        } else {
          console.log('Object deleted:', data);
        }
      });
    } catch (error) {
      throw new Error(error)
    }

  }

}
