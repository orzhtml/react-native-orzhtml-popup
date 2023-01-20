import React from 'react'

import Overlay from '../Overlay'
import ActionPopoverView from './ActionPopoverView'

function ActionPopover () {
  function show (fromBounds, items, options = {}) {
    console.log('fromBounds, items, options:', fromBounds, items, options)
    let key = Overlay.show(
      <ActionPopoverView fromBounds={fromBounds} items={items} {...options} />,
    )
    return key
  }

  return { show }
}

export default new ActionPopover()
