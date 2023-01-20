import React from 'react'

import Overlay from '../Overlay'
import LoadingView from './LoadingView'

function Loading () {
  let loadingRef = null
  let LoadingKey = 0

  function show (title = null, options = { titleStyle: {}, size: 'large', color: '#000', icon: null, iconStyle: {} }) {
    if (LoadingKey) {
      return
    }

    let props = {
      title: title,
      overlayOpacity: 0,
      ...options,
    }
    LoadingKey = Overlay.show(<LoadingView ref={ref => loadingRef = ref} {...props} />)
    return LoadingKey
  }

  function hide () {
    Overlay.hide(LoadingKey)
    LoadingKey = 0
  }

  function setText (title) {
    loadingRef && loadingRef.updateTitle(title)
  }

  return {
    show,
    hide,
    setText,
  }
}

export default new Loading()
