import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import DatePickerView from './DatePickerView'

class PullPicker {
  static show ({ value, confirm, options = {} }: {
    value: string,
    confirm: (date: string) => void,
    options?: { [x: string]: any }
  }) {
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

export default PullPicker
