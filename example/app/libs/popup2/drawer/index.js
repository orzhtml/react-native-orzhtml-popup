import React from 'react'
import { Keyboard } from 'react-native'

import Overlay from '../Overlay'
import DrawerView from './DrawerView'

function Drawer () {
  let key = 0
  function open ({ view, side = 'left', rootTransform = 'none', onClose, options = {} }) {
    Keyboard.dismiss()

    key = Overlay.show(
      <DrawerView
        view={view}
        side={side}
        rootTransform={rootTransform}
        onClose={onClose}
        {...options}
      />,
    )

    return key
  }

  function close (_key) {
    Overlay.hide(_key)
    key = 0
  }

  return {
    key,
    open,
    close,
  }
}

export default new Drawer()
