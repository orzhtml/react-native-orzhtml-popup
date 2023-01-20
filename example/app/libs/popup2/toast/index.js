import React from 'react'

import Overlay from '../Overlay'
import ToastView from './ToastView'

function Toast () {
  const defaultDuration = 'short'
  const defaultPosition = 'center'

  function show (options) {
    let { duration, ...others } = options && typeof options === 'object' ? options : {}

    let key = Overlay.show(<ToastView {...others} />)

    if (typeof duration !== 'number') {
      switch (duration) {
        case 'long': duration = 3500; break
        default: duration = 2000; break
      }
    }
    console.log('show:', key)
    setTimeout(() => {
      Overlay.hide(key)
    }, duration)

    return key
  }

  function hide (key) {
    console.log('hide:', key)
    Overlay.hide(key)
  }

  function message (text, duration = defaultDuration, position = defaultPosition) {
    let key = show({ text, duration, position })
    return key
  }

  function success (text, duration = defaultDuration, position = defaultPosition) {
    let key = show({ text, duration, position, icon: 'success' })
    return key
  }

  return { show, hide, message, success }
}

export default new Toast()
