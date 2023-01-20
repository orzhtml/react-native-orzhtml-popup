import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import PullPickerView from './PullPickerView'

function PullPicker () {
  function show ({ items, value, confirm, options = {} }) {
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

  return { show }
}

export default new PullPicker()
