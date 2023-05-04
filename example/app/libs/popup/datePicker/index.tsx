import React from 'react'
import { Keyboard } from 'react-native'

import { IDatePickerProps } from '../common/Common'
import Overlay from '../Overlay'
import DatePickerView from './DatePickerView'

class DatePicker {
  static show ({ value, confirm, options = {} }: IDatePickerProps) {
    Keyboard.dismiss()

    let key = Overlay.show(
      <DatePickerView
        value={value}
        confirm={confirm}
        {...options}
      />,
    )

    return key
  }
}

export default DatePicker
