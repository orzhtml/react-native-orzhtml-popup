import React from 'react'
import { ImageSourcePropType, ImageStyle, StyleProp, TextStyle } from 'react-native'

import { LoadingHandleRef } from '../common/Common'
import Overlay from '../Overlay'
import LoadingView from './Loading'

class Loading {
  static loadingRef = {
    updateTitle: (title: string) => {},
  }

  static LoadingKey = 0

  static show (title = null, options: {
    titleStyle?: StyleProp<TextStyle>,
    size?: number | 'small' | 'large' | undefined,
    color?: string,
    icon?: ImageSourcePropType | null,
    iconStyle?: StyleProp<ImageStyle>,
  } = {
    size: 'large',
    color: '#191D26',
  }) {
    if (this.LoadingKey) {
      return
    }

    let props = {
      title: title,
      overlayOpacity: 0,
      ...options,
    }
    this.LoadingKey = Overlay.show(<LoadingView ref={(ref: LoadingHandleRef) => this.loadingRef = ref} {...props} />)
    return this.LoadingKey
  }

  static hide () {
    Overlay.hide(this.LoadingKey)
    this.LoadingKey = 0
  }
}

export default Loading
