import React from 'react'
import { Keyboard } from 'react-native'

import { ActionSheetProps } from '../common/Common'
import Overlay from '../Overlay'
import ActionSheetView from './ActionSheet'

class ActionSheet {
  static show<T> ({ items, confirm, cancel, options = {} }: ActionSheetProps<T>) {
    Keyboard.dismiss()

    let key = Overlay.show(
      <ActionSheetView
        items={items}
        confirm={confirm}
        cancel={cancel}
        {...options}
      />,
    )

    return key
  }
}

export default ActionSheet
