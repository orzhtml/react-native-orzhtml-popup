import { scaleSizeFool } from './SetSize'

const initViewProps = {
  modal: false,
  animated: true,
  overlayPointerEvents: 'auto',
  isBackPress: true,
  overlayOpacity: 0.55,
}

const initZoomProps = {
  type: 'zoomIn', // zoomOut，fade，none
}

const initToastProps = {
  position: 'center',
}

const initPullProps = {
  side: 'bottom',
}

const initActionSheetProps = {
  label: 'label',
  labelVal: 'value',
  containerStyle: {
    backgroundColor: 'transparent',
  },
}

const initPullPickerProps = {
  label: 'label',
  labelVal: 'value',
  wheelHeight: scaleSizeFool(200),
}

const initDatePickerProps = {
  max: 2050,
  min: 2010,
  showYear: true,
  showMonth: true,
  showDay: true,
}

const initWheelProps = {
  pointerEvents: 'box-only',
  defaultIndex: 0,
}

const btnColor = {
  default: '#1ACB79',
  cancel: '#3E3E3E',
  warning: '#FF5363',
}

function defaultProps (props: any, initProps: any) {
  return {
    ...initProps,
    ...props,
  }
}

function disappearCompleted (onCloseCallback: () => any, onDisappearCompleted: () => any) {
  onCloseCallback && onCloseCallback()
  onDisappearCompleted && onDisappearCompleted()
}

// 是否是数组
function isArray (arg: any) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

// 是否是对象
function isObject (arg: any) {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

// 是否是字符串
function isString (arg: any) {
  return Object.prototype.toString.call(arg) === '[object String]'
}

function isEmpty (str: string | null | undefined) {
  return str === null || str === '' || str === undefined
}

function isLeapYear (year: number) {
  return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
}

export {
  initViewProps,
  initZoomProps,
  initToastProps,
  initPullProps,
  initActionSheetProps,
  initPullPickerProps,
  initDatePickerProps,
  initWheelProps,
  defaultProps,
  btnColor,
  disappearCompleted,
  isArray,
  isObject,
  isString,
  isEmpty,
  isLeapYear,
}
