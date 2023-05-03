import React from 'react'
import { Keyboard } from 'react-native'

import { IPullPickerProps } from '../common/Common'
import Overlay from '../Overlay'
import DatePickerView from './DatePickerView'

class PullPicker {
  static show ({ value, confirm, options = {} }: IPullPickerProps) {
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
