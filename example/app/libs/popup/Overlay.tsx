import React from 'react'

import Popup from './Popup'
// import PView from './PView'
// import PopView from './PopView'
// import PullView from './PullView'

const Overlay = () => {
  function show (view: React.FunctionComponentElement<{
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

  function hide (key: React.Key) {
    Popup.remove(key)
  }

  return {
    show,
    hide,
    // View: PView,
    // PopView: PopView,
    // PullView: PullView,
  }
}

export default new (Overlay as any)()
