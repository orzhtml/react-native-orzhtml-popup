import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import ActionSheetView from './ActionSheetView'

function ActionSheet () {
  function show ({ items, confirm, cancel, options = {} }) {
    Keyboard.dismiss()

    let key = Overlay.show(<ActionSheetView
      items={items}
      confirm={confirm}
      cancel={cancel}
      {...options}
    />)

    return key
  }

  return { show }
}

export default new ActionSheet()
