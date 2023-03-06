import React, { FC, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, LayoutRectangle, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { marginStart, marginStop } from './common/Animated'
import { disappearCompleted, initViewProps, IProps, popRefType } from './common/Common'
import PView from './PView'

interface CProps extends IProps {
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    barStyles?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    side: 'bottom' | 'top' | 'left' | 'right',
    content?: React.ReactNode,
    onDisappearCompleted?: () => void,
    onCloseRequest?: () => void,
    onAppearCompleted?: () => void,
}

interface PullViewProps extends CProps {
    refInstance: React.ForwardedRef<any>,
}

const PullView: FC<PullViewProps> = (props) => {
  const viewLayout = useRef<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 })
  const popRef = useRef<popRefType>(null)
  const closed = useRef(false)
  const marginValue = useRef(new Animated.Value(0))
  let [showed, setShowed] = useState(false)

  const hide = ({ onCloseCallback }: {
        onCloseCallback?: () => void
    }) => {
    if (closed.current) return true
    closed.current = true
    disappear({
      side: props.side,
      marginValue: marginValue.current,
      viewLayout: viewLayout.current,
    })
    popRef.current?.close(() => {
      disappearCompleted(onCloseCallback, props.onDisappearCompleted)
    })
    return true
  }

  useImperativeHandle(props.refInstance, () => ({
    close: (onCloseCallback?: () => void) => {
      hide({ onCloseCallback })
    },
  }))

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewLayout.current = event.nativeEvent.layout

    if (!showed) {
      setShowed(true)
      appear({
        onAppearCompleted: props.onAppearCompleted,
        viewLayout: viewLayout.current,
        side: props.side,
        marginValue: marginValue.current,
      })
    }
  }, [props.onAppearCompleted, props.side, showed, marginValue])

  const buildStyle = () => {
    let sideStyle: ViewStyle
    // Set flexDirection so that the content view will fill the side
    switch (props.side) {
      case 'top':
        sideStyle = { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }
        break
      case 'left':
        sideStyle = { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch' }
        break
      case 'right':
        sideStyle = { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'stretch' }
        break
      default:
        sideStyle = { flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }
    }
    return sideStyle
  }

  let { containerStyle, side, content, children, barStyles } = props

  let contentStyle: {
        marginTop?: Animated.Value,
        marginLeft?: Animated.Value,
        marginRight?: Animated.Value,
        marginBottom?: Animated.Value,
        opacity?: number;
    } = {}
  switch (side) {
    case 'top':
      contentStyle = { marginTop: marginValue.current }
      break
    case 'left':
      contentStyle = { marginLeft: marginValue.current }
      break
    case 'right':
      contentStyle = { marginRight: marginValue.current }
      break
    default:
      contentStyle = { marginBottom: marginValue.current }
  }

  contentStyle.opacity = showed ? 1 : 0

  return (
    <PView
      ref={popRef}
      style={buildStyle()}
      onCloseRequest={() => {
        if (props.onCloseRequest) {
          props.onCloseRequest && props.onCloseRequest()
        } else {
          if (!props.modal) {
            hide({ onCloseCallback: undefined })
          }
        }
      }}
      barStyles={barStyles}
      modal={props.modal}
      overlayOpacity={props.overlayOpacity}
      isBackPress={props.isBackPress}
    >
      <Animated.View
        style={[StyleSheet.flatten(containerStyle), contentStyle]}
        onLayout={onLayout}
      >
        {content || children}
      </Animated.View>
    </PView>
  )
}

function appear ({ side, marginValue, onAppearCompleted, viewLayout }: {
    side: 'bottom' | 'top' | 'left' | 'right',
    marginValue: Animated.Value,
    onAppearCompleted?: () => void,
    viewLayout: LayoutRectangle,
}) {
  marginValue.setValue(marginSize(side, viewLayout))
  Animated.parallel(marginStart(marginValue)).start(e => {
    onAppearCompleted && onAppearCompleted()
  })
}

function disappear ({ side, marginValue, viewLayout }: {
    side: 'bottom' | 'top' | 'left' | 'right',
    marginValue: Animated.Value,
    viewLayout: LayoutRectangle,
}) {
  Animated.parallel(marginStop(marginValue, marginSize(side, viewLayout)))
    .start(e => { })
}

function marginSize (side: 'bottom' | 'top' | 'left' | 'right', viewLayout: LayoutRectangle) {
  if (side === 'left' || side === 'right') {
    return -viewLayout.width
  } else {
    return -viewLayout.height
  }
}

const Component = PullView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    side: 'bottom',
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
