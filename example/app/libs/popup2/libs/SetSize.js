import { Dimensions } from 'react-native'

// iphone6的像素密度
const defaultPixel = 2
// px 转换成 dp
const w2 = 750 / defaultPixel
const h2 = 1334 / defaultPixel
// 获取缩放比例
const scale = Math.min(Dimensions.get('window').height / h2, Dimensions.get('window').width / w2)

export const scaleSize = (size) => {
  let _size = Math.round(size * scale)
  return _size
}
