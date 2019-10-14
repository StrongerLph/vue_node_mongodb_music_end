const Song = require('../db_modules/songs')

module.exports = {
    find(filterData) {
        return new Promise((resolve, reject) => {
            Song.find(filterData, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    save(data) {
        return new Promise((resolve, reject) => {
            const song = new Song(data)
            song.save(err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}