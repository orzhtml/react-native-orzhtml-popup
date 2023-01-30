import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import ActionSheetView from './ActionSheet'

class ActionSheet {
  static show ({ items, confirm, cancel, options = {} }: {
        items: { [x: string]: any }[];
        confirm: (item: { [x: string]: any }, index: React.Key) => void;
        cancel: () => void;
        options: { [x: string]: any }
    }) {
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
