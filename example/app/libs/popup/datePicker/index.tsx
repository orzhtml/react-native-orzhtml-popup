import React from 'react'
import { Keyboard } from 'react-native'

import type { IDatePickerProps } from '../common/Type'
import Overlay from '../Overlay'
import DatePickerView from './DatePickerView'

class DatePicker {
  static leftBtnText = '取消'
  static rightBtnText = '完成'
  static yearText = '年'
  static monthText = '月'
  static dayText = '日'
  static show ({ value, confirm, options }: IDatePickerProps) {
    Keyboard.dismiss()

    const {
      leftBtnText = this.leftBtnText,
      rightBtnText = this.rightBtnText,
      yearText = this.yearText,
      monthText = this.monthText,
      dayText = this.dayText,
      ...other
    } = options || {}

    let key = Overlay.show(
      <DatePickerView
        value={value}
        confirm={confirm}
        leftBtnText={leftBtnText}
        rightBtnText={rightBtnText}
        yearText={yearText}
        monthText={monthText}
        dayText={dayText}
        {...other}
      />,
    )

    return key
  }
}

export const setDatePickerPopupDefaultLabels = (options: {
  leftBtnText: string,
  rightBtnText: string,
  yearText: string,
  monthText: string,
  dayText: string,
 }) => {
  DatePicker.leftBtnText = options.leftBtnText
  DatePicker.rightBtnText = options.rightBtnText
  DatePicker.yearText = options.yearText
  DatePicker.monthText = options.monthText
  DatePicker.dayText = options.dayText
}

export default DatePicker
