import React from 'react'
import { durationType, ToastPosition } from '../common/Common'

import Overlay from '../Overlay'
import ToastView from './ToastView'

class Toast {
  static defaultDuration: durationType = 'short'
  static defaultPosition: ToastPosition = 'center'

  static show (options: { [x: string]: any; duration: durationType }) {
    let { duration, ...others } = options && typeof options === 'object' ? options : { duration: 2000 }

    let key: React.Key = Overlay.show(<ToastView {...others} />)

    if (typeof duration !== 'number') {
      switch (duration) {
        case 'long': duration = 3500; break
        default: duration = 2000; break
      }
    }

    setTimeout(() => this.hide(key), duration)

    return key
  }

  static hide (key: React.Key) {
    Overlay.hide(key)
  }

  static message (text: string | number | React.ReactNode, duration = this.defaultDuration, position = this.defaultPosition) {
    let key: React.Key = this.show({ text, duration, position })
    return key
  }

  static success (text: string | number | React.ReactNode, duration = this.defaultDuration, position = this.defaultPosition) {
    let key = this.show({ text, duration, position, icon: 'success' })
    return key
  }
}

export default Toast