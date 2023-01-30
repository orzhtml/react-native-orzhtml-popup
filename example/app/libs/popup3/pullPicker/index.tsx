
import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import PullPickerView from './PullPickerView'

class PullPicker {
  static show ({ items, value, confirm, options = {} }: any) {
    Keyboard.dismiss()

    let key = Overlay.show(
      <PullPickerView
        items={items}
        value={value}
        confirm={confirm}
        {...options}
      />,
    )

    return key
  }
}

export default PullPicker
