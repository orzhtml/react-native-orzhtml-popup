import React from 'react'

import Overlay from '../Overlay'
import { fromBoundsType } from '../common/Common'

import ActionPopoverView from './ActionPopoverView'

class ActionPopover {
  static show (fromBounds: fromBoundsType, items: {
    type?: string,
    title: string,
    onPress: () => void,
  }[], options = {}) {
    console.log('fromBounds, items, options:', fromBounds, items, options)
    let key = Overlay.show(
      <ActionPopoverView fromBounds={fromBounds} items={items} {...options} />,
    )
    return key
  }
}

export default ActionPopover
