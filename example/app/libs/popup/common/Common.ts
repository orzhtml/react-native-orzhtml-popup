import { PixelRatio } from 'react-native'

import { scaleSizeFool } from './SetSize'

export type OverlayPointerEvents = 'none' | 'box-only' | 'auto' | undefined;

export type ToastPosition = 'center' | 'top' | 'bottom' | undefined;

export type durationType = 'short' | 'long' | number

export type popoverArrow = 'none' |
  'topLeft' |
  'top' |
  'topRight' |
  'rightTop' |
  'right' |
  'rightBottom' |
  'bottomRight' |
  'bottom' |
  'bottomLeft' |
  'leftBottom' |
  'left' |
  'leftTop';

export const pixelSize = (function () {
  let pixelRatio = PixelRatio.get()
  if (pixelRatio >= 3) return 0.3333333333333333
  else if (pixelRatio >= 2) return 0.5
  else return 1
})()

export const initViewProps = {
  modal: false,
  animated: true,
  overlayPointerEvents: 'auto',
  isBackPress: true,
  overlayOpacity: 0.55,
}

export const initZoomProps = {
  type: 'zoomIn', // zoomOut，fade，none
}

export const initToastProps = {
  position: 'center',
}

export const initPullProps = {
  side: 'bottom',
}

export const initActionSheetProps = {
  label: 'label',
  labelVal: 'value',
  containerStyle: {
    backgroundColor: 'transparent',
  },
}

export const initPullPickerProps = {
  label: 'label',
  labelVal: 'value',
  wheelHeight: scaleSizeFool(200),
}

export const initDatePickerProps = {
  max: 2050,
  min: 2010,
  showYear: true,
  showMonth: true,
  showDay: true,
}

export const initWheelProps = {
  pointerEvents: 'box-only',
  defaultIndex: 0,
}

export const btnColor = {
  default: '#1ACB79',
  cancel: '#3E3E3E',
  warning: '#FF5363',
}

export function defaultProps (props: any, initProps: any) {
  return {
    ...initProps,
    ...props,
  }
}

export function disappearCompleted (onCloseCallback?: () => any, onDisappearCompleted?: () => any) {
  onCloseCallback && onCloseCallback()
  onDisappearCompleted && onDisappearCompleted()
}

// 是否是数组
export function isArray (arg: any) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

// 是否是对象
export function isObject (arg: any) {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

// 是否是字符串
export function isString (arg: any) {
  return Object.prototype.toString.call(arg) === '[object String]'
}

export function isEmpty (str: string | null | undefined) {
  return str === null || str === '' || str === undefined
}

export function isLeapYear (year: number) {
  return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
}
