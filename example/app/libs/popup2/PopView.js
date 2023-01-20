import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Animated } from 'react-native'

import { initViewProps, initZoomProps, defaultProps, disappearCompleted } from './libs/Common'
import { fadeStart, fadeStop, zoomStart, zoomStop } from './libs/Animated'
import PView from './PView'

const PopView = forwardRef((props, ref) => {
  const propsData = defaultProps(props, { ...initViewProps, ...initZoomProps })
  let viewLayout = useRef({ x: 0, y: 0, width: 0, height: 0 })
  let popRef = useRef(null)
  let closed = useRef(false)
  let [opacityAnim] = useState(new Animated.Value(0))
  let [translateX] = useState(new Animated.Value(0))
  let [translateY] = useState(new Animated.Value(0))
  let [scaleX] = useState(new Animated.Value(0))
  let [scaleY] = useState(new Animated.Value(0))
  let [showed, setShowed] = useState(false)

  const hide = ({ onCloseCallback }) => {
    // console.log('PopView hide')
    if (closed.current) return true
    closed.current = true
    disappear({
      type: propsData.type,
      customBounds: propsData.customBounds,
      opacityAnim,
      translateX,
      translateY,
      scaleX,
      scaleY,
      viewLayout: viewLayout.current,
    })
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(onCloseCallback, propsData.onDisappearCompleted)
    })
    return true
  }

  useImperativeHandle(ref, () => ({
    close: (onCloseCallback) => {
      hide({ onCloseCallback })
    },
  }))

  const onLayout = (e) => {
    // console.log('PopView onLayout')
    viewLayout.current = e.nativeEvent.layout

    if (!showed) {
      setShowed(true)
      appear({
        onAppearCompleted: propsData.onAppearCompleted,
        viewLayout: viewLayout.current,
        type: propsData.type,
        customBounds: propsData.customBounds,
        opacityAnim: opacityAnim,
        translateX: translateX,
        translateY: translateY,
        scaleX: scaleX,
        scaleY: scaleY,
      })
    }
  }

  let { containerStyle, style, content, children, barStyles } = propsData

  containerStyle = [{
    backgroundColor: 'rgba(0, 0, 0, 0)',
    minWidth: 1,
    minHeight: 1,
  }].concat(containerStyle).concat({
    opacity: showed ? opacityAnim : 0,
    transform: [{ translateX }, { translateY }, { scaleX }, { scaleY }],
  })

  return (
    <PView
      ref={popRef}
      style={[{ justifyContent: 'center', alignItems: 'center' }, style]}
      barStyles={barStyles}
      onCloseRequest={() => {
        if (propsData.onCloseRequest) {
          propsData.onCloseRequest && propsData.onCloseRequest()
        } else {
          if (!propsData.modal) {
            hide({ onCloseCallback: null })
          }
        }
      }}
      animated={propsData.animated}
      modal={propsData.modal}
      overlayOpacity={propsData.overlayOpacity}
      isBackPress={propsData.isBackPress}
    >
      <Animated.View style={containerStyle} pointerEvents='box-none' onLayout={(e) => onLayout(e)}>
        {content || children}
      </Animated.View>
    </PView>
  )
})

function appear ({
  type, customBounds, opacityAnim, onAppearCompleted,
  translateX, translateY, scaleX, scaleY, viewLayout,
}) {
  let ft = fromTransform(type, customBounds, viewLayout)

  if (type === 'fade') {
    opacityAnim.setValue(0)
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
    Animated.parallel(fadeStart(opacityAnim, 1)).start(e => {
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
    Animated.parallel(zoomStart(opacityAnim, translateX, translateY, scaleX, scaleY)).start(e => {
      onAppearCompleted && onAppearCompleted()
    })
  }
}

function disappear ({
  type, customBounds, opacityAnim,
  translateX, translateY, scaleX, scaleY, viewLayout,
}) {
  let ft = fromTransform(type, customBounds, viewLayout)
  if (type === 'fade') {
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
    Animated.parallel(fadeStop(opacityAnim)).start(e => {})
  } else if (type === 'none') {
    opacityAnim.setValue(0)
    translateX.setValue(0)
    translateY.setValue(0)
    scaleX.setValue(1)
    scaleY.setValue(1)
  } else {
    Animated.parallel(zoomStop(ft, opacityAnim, translateX, translateY, scaleX, scaleY)).start(e => {})
  }
}

function fromTransform (type, customBounds, viewLayout) {
  let fb = fromBounds(type, customBounds, viewLayout)
  let tb = viewLayout
  let transform = {
    translateX: (fb.x + fb.width / 2) - (tb.x + tb.width / 2),
    translateY: (fb.y + fb.height / 2) - (tb.y + tb.height / 2),
    scaleX: fb.width / tb.width,
    scaleY: fb.height / tb.height,
  }
  return transform
}

function fromBounds (type, customBounds, viewLayout) {
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

export default PopView
