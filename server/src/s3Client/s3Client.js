import 'dotenv/config';
import AWS from 'aws-sdk';

const s3Client = new AWS.S3({
    endpoint: "nyc3.digitaloceanspaces.com",
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.SPACES_KEY,
      secretAccessKey: process.env.SPACES_SECRET,
    }
  });

  export default s3Client