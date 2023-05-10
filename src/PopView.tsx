import React, { FC, forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react'
import { Animated, LayoutChangeEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { fadeStart, fadeStop, zoomStart, zoomStop } from './common/Animated'
import { disappearCompleted, initViewProps } from './common/Common'
import type { IProps, PopHandleRef, PVHandleRef } from './common/Type'
import PView from './PView'

interface CProps extends IProps {
    type?: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none',
    children?: React.ReactNode,
    content?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    barStyles?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    customBounds?: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    onDisappearCompleted?: () => void,
    onAppearCompleted?: () => void,
    onCloseRequest?: () => void,
}

interface PopViewProps extends CProps {
    refInstance: React.ForwardedRef<PopHandleRef>,
}

const PopView: FC<PopViewProps> = (props) => {
  const viewLayout = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const PVRef = useRef<PVHandleRef>(null)
  const closed = useRef(false)
  const opacityAnim = useRef(new Animated.Value(0))
  const translateX = useRef(new Animated.Value(0))
  const translateY = useRef(new Animated.Value(0))
  const scaleX = useRef(new Animated.Value(0))
  const scaleY = useRef(new Animated.Value(0))
  let [showed, setShowed] = useState(false)

  const hide = ({ onCloseCallback }: {
    onCloseCallback?: () => void
}) => {
    if (closed.current) return true
    closed.current = true
    disappear({
      type: props.type,
      customBounds: props.customBounds,
      opacityAnim: opacityAnim.current,
      translateX: translateX.current,
      translateY: translateY.current,
      scaleX: scaleX.current,
      scaleY: scaleY.current,
      viewLayout: viewLayout.current,
    })
    PVRef.current?.close(() => {
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
        type: props.type,
        customBounds: props.customBounds,
        opacityAnim: opacityAnim.current,
        translateX: translateX.current,
        translateY: translateY.current,
        scaleX: scaleX.current,
        scaleY: scaleY.current,
      })
    }
  }, [props.onAppearCompleted, props.type, props.customBounds,
    showed, opacityAnim, translateX, translateY, scaleX, scaleY])

  let _containerStyle = [{
    backgroundColor: 'rgba(0, 0, 0, 0)',
    minWidth: 1,
    minHeight: 1,
  }, StyleSheet.flatten(props.containerStyle), {
    opacity: showed ? opacityAnim.current : 0,
    transform: [
      { translateX: translateX.current },
      { translateY: translateY.current },
      { scaleX: scaleX.current },
      { scaleY: scaleY.current },
    ],
  }]

  return (
    <PView
      ref={PVRef}
      style={[{
        justifyContent: 'center',
        alignItems: 'center',
      }, StyleSheet.flatten(props.style)]}
      barStyles={props.barStyles}
      onCloseRequest={() => {
        if (props.onCloseRequest) {
          props.onCloseRequest && props.onCloseRequest()
        } else {
          if (!props.modal) {
            hide({ onCloseCallback: undefined })
          }
        }
      }}
      animated={props.animated}
      modal={props.modal}
      overlayOpacity={props.overlayOpacity}
      isBackPress={props.isBackPress}
    >
      <Animated.View
        style={_containerStyle}
        pointerEvents='box-none'
        onLayout={(e) => onLayout(e)}
      >
        {props.content || props.children}
      </Animated.View>
    </PView>
  )
}

function appear ({
  type, customBounds, opacityAnim, onAppearCompleted,
  translateX, translateY, scaleX, scaleY, viewLayout,
}: {
    type: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none' | undefined,
    customBounds?: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    opacityAnim: Animated.Value,
    onAppearCompleted?: () => void,
    translateX: Animated.Value,
    translateY: Animated.Value,
    scaleX: Animated.Value,
    scaleY: Animated.Value,
    viewLayout: {
        x: number;
        y: number;
        width: number;
        height: number;
    },
}) {
  let ft = fromTransform(type, viewLayout, customBounds)

  if (type === 'fade') {
    opacityAnim.setValue(0)
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
    Animated.parallel(fadeStart(opacityAnim, 1)).start(() => {
      onAppearCompleted && onAppearCompleted()
    })
  } else if (type === 'none') {
    opacityAnim.setValue(1)
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
    onAppearCompleted && onAppearCompleted()
  } else {
    opacityAnim.setValue(0)
    translateX.setValue(ft.translateX)
    translateY.setValue(ft.translateY)
    scaleX.setValue(ft.scaleX)
    scaleY.setValue(ft.scaleY)
    Animated.parallel(zoomStart(opacityAnim, translateX, translateY, scaleX, scaleY)).start(() => {
      onAppearCompleted && onAppearCompleted()
    })
  }
}

function disappear ({
  type, customBounds, opacityAnim,
  translateX, translateY, scaleX, scaleY, viewLayout,
}: {
    type: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none' | undefined,
    customBounds?: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    opacityAnim: Animated.Value,
    translateX: Animated.Value,
    translateY: Animated.Value,
    scaleX: Animated.Value,
    scaleY: Animated.Value,
    viewLayout: {
        x: number;
        y: number;
        width: number;
        height: number;
    },
}) {
  let ft = fromTransform(type, viewLayout, customBounds)
  if (type === 'fade') {
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
    Animated.parallel(fadeStop(opacityAnim)).start(() => { })
  } else if (type === 'none') {
    opacityAnim.setValue(0)
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
  } else {
    Animated.parallel(zoomStop(ft, opacityAnim, translateX, translateY, scaleX, scaleY)).start(() => { })
  }
}

function fromTransform (type: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none' | undefined, viewLayout: {
    x: number;
    y: number;
    width: number;
    height: number;
}, customBounds?: {
    x: number,
    y: number,
    width: number,
    height: number,
}) {
  let fb = fromBounds(type, viewLayout, customBounds)
  let tb = viewLayout
  let transform = {
    translateX: (fb.x + fb.width / 2) - (tb.x + tb.width / 2),
    translateY: (fb.y + fb.height / 2) - (tb.y + tb.height / 2),
    scaleX: fb.width / tb.width,
    scaleY: fb.height / tb.height,
  }
  return transform
}

function fromBounds (type: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none' | undefined, viewLayout: {
    x: number,
    y: number,
    width: number,
    height: number,
}, customBounds?: {
    x: number,
    y: number,
    width: number,
    height: number,
}) {
  let bounds
  if (type === 'custom' && !customBounds) {
    console.error('PopView: customBounds can not be null when type is "custom"')
  }
  if (type === 'custom' && customBounds) {
    return customBounds
  }
  let zoomRate = type === 'zoomIn' ? 0.3 : 1.2
  let { x, y, width, height } = viewLayout
  bounds = {
    x: x - (width * zoomRate - width) / 2,
    y: y - (height * zoomRate - height) / 2,
    width: width * zoomRate,
    height: height * zoomRate,
  }
  return bounds
}

const Component = PopView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef<PopHandleRef, Partial<CProps>>((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    type: 'zoomIn',
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
