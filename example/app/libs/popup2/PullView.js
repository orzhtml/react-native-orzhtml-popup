import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Animated } from 'react-native'

import { initViewProps, initPullProps, defaultProps, disappearCompleted } from './libs/Common'
import { marginStart, marginStop } from './libs/Animated'
import PView from './PView'

const PullView = forwardRef((props, ref) => {
  const propsData = defaultProps(props, { ...initViewProps, ...initPullProps })
  let viewLayout = useRef({ x: 0, y: 0, width: 0, height: 0 })
  let popRef = useRef(null)
  let closed = useRef(false)
  let [marginValue] = useState(new Animated.Value(0))
  let [showed, setShowed] = useState(false)

  const hide = ({ onCloseCallback }) => {
    // console.log('PullView hide')
    if (closed.current) return true
    closed.current = true
    disappear({
      side: propsData.side,
      marginValue,
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
    viewLayout.current = e.nativeEvent.layout

    if (!showed) {
      // console.log('PullView onLayout')
      setShowed(true)
      appear({
        onAppearCompleted: propsData.onAppearCompleted,
        viewLayout: viewLayout.current,
        side: propsData.side,
        marginValue,
      })
    }
  }

  const buildStyle = () => {
    let sideStyle
    // Set flexDirection so that the content view will fill the side
    switch (propsData.side) {
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

  let { containerStyle, side, content, children, barStyles } = propsData

  let contentStyle = {}
  switch (side) {
    case 'top':
      contentStyle = { marginTop: marginValue }
      break
    case 'left':
      contentStyle = { marginLeft: marginValue }
      break
    case 'right':
      contentStyle = { marginRight: marginValue }
      break
    default:
      contentStyle = { marginBottom: marginValue }
  }

  contentStyle.opacity = showed ? 1 : 0
  let _containerStyle = [].concat(containerStyle).concat(contentStyle)
  return (
    <PView
      ref={popRef}
      style={buildStyle()}
      onCloseRequest={() => {
        if (propsData.onCloseRequest) {
          propsData.onCloseRequest && propsData.onCloseRequest()
        } else {
          if (!propsData.modal) {
            hide({ onCloseCallback: null })
          }
        }
      }}
      barStyles={barStyles}
      modal={propsData.modal}
      overlayOpacity={propsData.overlayOpacity}
      isBackPress={propsData.isBackPress}
    >
      <Animated.View style={_containerStyle} onLayout={(e) => onLayout(e)}>
        {content || children}
      </Animated.View>
    </PView>
  )
})

function appear ({ side, marginValue, onAppearCompleted, viewLayout }) {
  marginValue.setValue(marginSize(side, viewLayout))
  Animated.parallel(marginStart(marginValue)).start(e => {
    onAppearCompleted && onAppearCompleted()
  })
}

function disappear ({ side, marginValue, viewLayout }) {
  Animated.parallel(marginStop(marginValue, marginSize(side, viewLayout)))
    .start(e => {})
}

function marginSize (side, viewLayout) {
  if (side === 'left' || side === 'right') {
    return -viewLayout.width
  } else {
    return -viewLayout.height
  }
}

export default PullView
