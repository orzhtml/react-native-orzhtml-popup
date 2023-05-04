import React from 'react'
import { Keyboard } from 'react-native'

import { IPullPickerProps } from '../common/Common'
import Overlay from '../Overlay'
import PullPickerView from './PullPickerView'

class PullPicker {
  static show<T> ({ items, value, confirm, options = {} }: IPullPickerProps<T>) {
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
