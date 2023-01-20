import { PixelRatio, Dimensions } from 'react-native'

// 返回字体大小缩放比例
const fontScale = PixelRatio.getFontScale()
// 当前设备的像素密度
const pixelRatio = PixelRatio.get()
// iphone6的像素密度
const defaultPixel = 2
// px 转换成 dp
const w2 = 750 / defaultPixel
const h2 = 1334 / defaultPixel
// 获取缩放比例
const scale = Math.min(Dimensions.get('window').height / h2, Dimensions.get('window').width / w2)

const setSpText = size => {
  let _size = Math.round(((size * scale + 0.5) * pixelRatio) / fontScale)
  return _size / pixelRatio
}

const scaleSize = size => {
  let _size = Math.round(size * scale + 0.5)
  return _size
}

const scaleSizeFool = size => {
  return Math.floor(scaleSize(size))
}

export { setSpText, scaleSize, scaleSizeFool }
