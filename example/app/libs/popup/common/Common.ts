import { PixelRatio, StyleProp, TextStyle, ViewStyle } from 'react-native'

export type OverlayPointerEvents = 'none' | 'box-only' | 'auto' | undefined;

export type ToastPosition = 'center' | 'top' | 'bottom' | undefined;

export type durationType = 'short' | 'long' | number

export type popoverArrow = 'none' | 'topLeft' | 'top' | 'topRight' |
  'rightTop' | 'right' | 'rightBottom' |
  'bottomRight' | 'bottom' | 'bottomLeft' |
  'leftBottom' | 'left' | 'leftTop';

export type AlertButtonType = {
  banClosed?: boolean;
  onPress?: (() => void) | undefined;
  style?: 'default' | 'cancel' | 'warning';
  text: string
}

export const arrowLayouts = {
  none: {},
  topLeft: { transform: [{ rotate: '45deg' }] },
  top: { transform: [{ rotate: '45deg' }] },
  topRight: { transform: [{ rotate: '45deg' }] },
  rightTop: { transform: [{ rotate: '135deg' }] },
  right: { transform: [{ rotate: '135deg' }] },
  rightBottom: { transform: [{ rotate: '135deg' }] },
  bottomRight: { transform: [{ rotate: '225deg' }] },
  bottom: { transform: [{ rotate: '225deg' }] },
  bottomLeft: { transform: [{ rotate: '225deg' }] },
  leftBottom: { transform: [{ rotate: '315deg' }] },
  left: { transform: [{ rotate: '315deg' }] },
  leftTop: { transform: [{ rotate: '315deg' }] },
}

export const pixelSize = (function () {
  let pixelRatio = PixelRatio.get()
  if (pixelRatio >= 3) return 0.3333333333333333
  else if (pixelRatio >= 2) return 0.5
  else return 1
})()

export const filterPopoverStyle = (fs: ViewStyle, includeRadius: boolean) => {
  if (!fs) {
    return {}
  }

  let {
    borderRadius, borderBottomLeftRadius,
    borderBottomRightRadius, borderTopLeftRadius,
    borderTopRightRadius,
    ...others
  } = fs
  let style = includeRadius ? {
    borderRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    ...others,
  } : { ...others }
  console.log('style:', style)

  return filterContentStyle(style)
}

export const filterContentStyle = (fs: ViewStyle) => {
  for (let key in fs) {
    if (fs[key] === undefined) {
      delete fs[key]
    }
  }
  return fs
}

export const btnColor = {
  default: '#1ACB79',
  cancel: '#3E3E3E',
  warning: '#FF5363',
}

export function disappearCompleted (onCloseCallback?: () => void, onDisappearCompleted?: () => void) {
  onCloseCallback && onCloseCallback()
  onDisappearCompleted && onDisappearCompleted()
}

// ???????????????
export function isArray (arg: any) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

// ???????????????
export function isObject (arg: any) {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

// ??????????????????
export function isString (arg: any) {
  return Object.prototype.toString.call(arg) === '[object String]'
}

export function isEmpty (str: string | null | undefined) {
  return str === null || str === '' || str === undefined
}

export function isLeapYear (year: number) {
  return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
}
