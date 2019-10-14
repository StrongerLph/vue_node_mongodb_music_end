const express = require('express');
const qiniu = require('qiniu')

const router = express.Router();
const config = require('../config/config')

const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)

const options = {
    scope: config.bucket,
    expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

router.get('/key', (req, res) => {
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    res.json({ code: 200, success: true, msg: 'success', result: { uploadToken: uploadToken } })
})

module.exports = router
