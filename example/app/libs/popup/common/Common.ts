import { PixelRatio, ViewStyle } from 'react-native'
import dayjs from 'dayjs'

import { scaleSize } from './SetSize'
import { headerLayoutsType, IProps } from './Type'

export const arrowLayouts: headerLayoutsType = {
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
    flexDirection, alignItems,
    justifyContent, margin, marginBottom, marginHorizontal,
    marginLeft, marginRight, marginTop, marginVertical, padding,
    paddingBottom, paddingHorizontal, paddingLeft, paddingRight,
    paddingTop, paddingVertical, backgroundColor, borderBottomColor,
    borderBottomLeftRadius, borderBottomRightRadius, borderBottomWidth,
    borderColor, borderLeftColor, borderLeftWidth, borderRadius,
    borderRightColor, borderRightWidth, borderStyle, borderTopColor,
    borderTopLeftRadius, borderTopRightRadius, borderTopWidth,
    borderWidth, ...others
  } = fs
  let style = includeRadius ? {
    borderRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    ...others,
  } : { ...others }

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
  onDisappearCompleted && onDisappearCompleted()
  onCloseCallback && onCloseCallback()
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

export function isEmpty (str: string | null | undefined | number): boolean {
  return str === null || str === '' || str === undefined
}

export function isLeapYear (year: number) {
  return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
}

export const initViewProps: IProps = {
  modal: false,
  animated: true,
  overlayPointerEvents: 'auto',
  isBackPress: true,
  overlayOpacity: 0.55,
  useDark: false,
}

export function maxOrMinDate (date: string) {
  const dayjsDate = dayjs(date)
  if (!dayjsDate.isValid()) {
    console.warn('不是有效日期格式，请检查:', date)
    return {
      year: 0,
      month: 0,
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }
  return {
    year: dayjsDate.year(),
    month: dayjsDate.month() + 1,
    day: dayjsDate.date(),
    hours: dayjsDate.hour(),
    minutes: dayjsDate.minute(),
    seconds: dayjsDate.second(),
  }
}

export const DatePickerInit = {
  value: '',
  max: '2080/12/31',
  min: '1900/01/01',
  showYear: true,
  showMonth: true,
  showDay: true,
  leftBtnText: '取消',
  rightBtnText: '完成',
  yearText: '年',
  monthText: '月',
  dayText: '日',
}

export const getMonths = (year: number, minYear: number, minMonth: number, maxYear: number, maxMonth: number, monthText: string) => {
  let startMonth = 1
  let endMonth = 12
  if (year === minYear) {
    startMonth = minMonth
  }
  if (year === maxYear) {
    endMonth = maxMonth
  }
  // if (year < minYear || year > maxYear) {
  //   return []
  // }
  const months = Array.from({ length: endMonth - startMonth + 1 }, (_, index) => {
    const month = startMonth + index
    return {
      label: `${month}${monthText}`,
      value: month,
    }
  })
  return months
}

export const PullPickerInit = {
  label: 'label',
  labelVal: 'value',
  wheelHeight: scaleSize(250),
  value: '',
  items: [],
  allText: '请选择',
  allVal: '',
  cancelText: '取消',
  completeText: '确定',
}

export function daysInMonth (month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}
