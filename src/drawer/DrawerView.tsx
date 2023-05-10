import React, { useRef, useCallback, forwardRef, FC } from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'

import { initViewProps, disappearCompleted } from '../common/Common'
import { IProps, PullVHandleRef } from '../common/Type'
import PullView from '../PullView'

interface CProps extends IProps {
    side: 'bottom' | 'top' | 'left' | 'right',
    label: string,
    labelVal: string,
    barStyles?: StyleProp<ViewStyle>,
    onClose?: () => void,
    onDisappearCompleted?: () => void,
    view: React.ReactNode,
}

interface DrawerProps extends CProps {
    refInstance: React.ForwardedRef<any>;
}

const DrawerView: FC<DrawerProps> = (props) => {
  const popRef = useRef<PullVHandleRef>(null)

  const hide = useCallback(() => {
    if (props.modal) {
      return null
    }
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(props.onClose, props.onDisappearCompleted)
    })
  }, [props.onDisappearCompleted, props.modal])

  return (
    <PullView
      ref={popRef}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      onCloseRequest={hide}
      side={props.side}
      modal={props.modal}
      isBackPress={false}
      barStyles={props.barStyles}
    >
      {props.view}
    </PullView>
  )
}

const Component = DrawerView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    label: 'label',
    labelVal: 'value',
    view: (<View />),
    side: 'left',
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
