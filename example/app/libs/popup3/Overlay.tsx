import React from 'react'

import Popup from './Popup'
import PView from './PView'
import PopView from './PopView'
import PullView from './PullView'

class Overlay {
  static View = PView
  static PopView = PopView
  static PullView = PullView

  static show (view: React.FunctionComponentElement<{
    onDisappearCompleted: () => void;
    onCloseCompleted: () => void;
  }>) {
    let key: React.Key = 0
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

  static hide (key: React.Key) {
    Popup.remove(key)
  }
}

export default Overlay
