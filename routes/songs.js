const express = require('express');

const router = express.Router();
const Song = require('../modules_controllers/songs')

router.get('/', (req, res) => {
    const { searchKey } = req.query
    const filter = new RegExp(decodeURIComponent(searchKey))
    Song.find({ $or: [{ name: { $regex: filter } }, { singer: { $regex: filter } }] }).then(data => {
        res.json({ code: 200, success: true, msg: 'success', result: { records: data, total: data.length } })
    }).catch(err => {
        res.json({ code: 500, success: false, msg: err })
    })
})

router.post('/upload', (req, res) => {
    const { name, songUrl, size } = req.body
    singer = name.split('-')[0].trim()
    songName = name.split('-')[1].split('.')[0].trim()
    Song.save({
        name: songName,
        singer: singer,
        songUrl: songUrl,
        size: size
    }).then(() => {
        res.json({ code: 200, success: true, msg: 'success' })
    }).catch(err => {
        res.json({ code: 500, success: false, msg: err })
    })
})

module.exports = router