import React from 'react'
import { Keyboard } from 'react-native'

import type { ActionSheetProps } from '../common/Type'
import Overlay from '../Overlay'
import ActionSheetView from './ActionSheet'

class ActionSheet {
  static cancelText = '取消'
  static show<T> ({ items, confirm, cancel, options }: ActionSheetProps<T>) {
    Keyboard.dismiss()

    const { cancelText = this.cancelText, ...other } = options || {}

    let key = Overlay.show(
      <ActionSheetView
        items={items}
        confirm={confirm}
        cancel={cancel}
        cancelText={cancelText}
        {...other}
      />,
    )

    return key
  }
}

export const setActionSheetPopupDefaultLabels = (options: { cancelText: string }) => {
  ActionSheet.cancelText = options.cancelText
}

export default ActionSheet
