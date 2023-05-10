import React from 'react'

import type { fromBoundsType } from '../common/Type'
import Overlay from '../Overlay'

import ActionPopoverView from './ActionPopoverView'

class ActionPopover {
  static show (fromBounds: fromBoundsType, items: {
    type?: string,
    title: string,
    onPress: (item: { type: string, title: string }) => void,
  }[], options = {}) {
    let key = Overlay.show(
      <ActionPopoverView fromBounds={fromBounds} items={items} {...options} />,
    )
    return key
  }
}

export default ActionPopover
