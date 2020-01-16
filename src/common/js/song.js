import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric) // 解码 得到字符串
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

// 抽象出一个工厂方法：传入musicData对象参数，实例化一个Song
export function createSong(musicData, vkey) {
  const guid = '6319873028'
  const uin = '0'
  return new Song({
    id: musicData.id,
    mid: musicData.mid || musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.name || musicData.songname,
    album: musicData.album ? musicData.album.name : musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album ? musicData.album.mid : musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C400${musicData.mid}.m4a?vkey=${vkey}&guid=${guid}&uin=${uin}&fromtag=66`
  })
}

// 格式化处理singer数据
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((element) => {
    ret.push(element.name)
  })

  return ret.join('/')
}