import React, { useRef, useCallback } from 'react'

import { initViewProps, initActionSheetProps, defaultProps, disappearCompleted } from '../libs/Common'
import PullView from '../PullView'

const DrawerView = (props) => {
  const propsData = defaultProps(props, { ...initViewProps, ...initActionSheetProps })
  let { onClose, onDisappearCompleted } = propsData
  let popRef = useRef(null)

  const hide = useCallback(() => {
    // console.log('DrawerView hide')
    if (propsData.modal) {
      return null
    }
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(onClose, onDisappearCompleted)
    })
  }, [onDisappearCompleted, propsData.modal])

  return (
    <PullView
      ref={popRef}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      onCloseRequest={hide}
      side={props.side}
      modal={propsData.modal}
      isBackPress={false}
      barStyles={props.barStyles}
    >
      {props.view}
    </PullView>
  )
}

export default DrawerView
