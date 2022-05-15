const aws = require('aws-sdk');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');
const uuid = require('uuid/v1');

const s3 = new aws.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: 'eu-central1',
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const fileType = req.query.fileType;
    const fileExt = fileType.substring(fileType.indexOf('/') + 1);
    const key = `${req.user.id}/${uuid()}.${fileExt}`;
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'pk-blog-bucket-456',
        Key: key,
        ContentType: 'image/jpeg',
      },
      (err, url) => res.send({ key, url })
    );
  });
};
