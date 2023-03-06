import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { durationType, OverlayPointerEvents, ToastPosition } from '../common/Common'

import Overlay from '../Overlay'
import ToastView from './Toast'

class Toast {
  static defaultDuration: durationType = 'short'
  static defaultPosition: ToastPosition = 'center'

  static show (options: {
    modal?: boolean,
    animated?: boolean,
    overlayPointerEvents?: OverlayPointerEvents,
    isBackPress?: boolean,
    useDark?: boolean,
    overlayOpacity?: number,
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    position?: ToastPosition,
    duration?: durationType,
    contentStyle?: StyleProp<ViewStyle>,
    text?: string | number | React.ReactNode,
    icon?: string | number | React.ReactNode,
   }) {
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
