import React from 'react'

import Popup from './Popup'
import PView from './PView'
import PopView from './PopView'
import PullView from './PullView'

const Overlay = () => {
  function show (view) {
    let key = null
    const onCloseCompleted = view.props.onCloseCompleted
    // 弹窗关闭后调用 onCloseCompleted
    const element = React.cloneElement(view, {
      onDisappearCompleted: () => {
        Popup.remove(key)
        onCloseCompleted && onCloseCompleted()
      },
    })

    key = Popup.add(element)
    return key
  }

  function hide (key) {
    Popup.remove(key)
  }

  return {
    show,
    hide,
    View: PView,
    PopView: PopView,
    PullView: PullView,
  }
}

export default new Overlay()
