import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import DatePickerView from './DatePickerView'

function PullPicker () {
  function show ({ value, confirm, options = {} }) {
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

  return { show }
}

export default new PullPicker()
