interface IStorageConfig {
  driver: 'disk' | 's3';

  config: {
    aws: {
      bucketName: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  config: {
    aws: {
      bucketName: 'S3 Bucket Name',
    },
  },
} as IStorageConfig;
