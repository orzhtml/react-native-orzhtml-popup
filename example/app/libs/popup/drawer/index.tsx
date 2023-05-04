import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import DrawerView from './DrawerView'

class Drawer {
  static key = 0
  static open ({ view, side = 'left', onClose, options = {} }: {
    view: React.ReactNode,
    side?: 'left' | 'right',
    rootTransform?: string,
    onClose?: () => void,
    options?: { [p: string]: any },
  }) {
    Keyboard.dismiss()

    this.key = Overlay.show(
      <DrawerView
        view={view}
        side={side}
        onClose={onClose}
        {...options}
      />,
    )

    return this.key
  }

  static close (_key: number) {
    Overlay.hide(_key)
    this.key = 0
  }
}

export default Drawer
