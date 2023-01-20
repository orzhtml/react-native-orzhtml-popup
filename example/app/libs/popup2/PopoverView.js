import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react'
import { Platform, Dimensions } from 'react-native'

import { initViewProps, disappearCompleted } from './libs/Common'
import { ItemProps } from './interface'
import PView from './PView'
import Popover from './popover'

const PopoverView = props => {
  const propsData = props
  const [fromBounds, setFromBounds] = useState(propsData.fromBounds)
  const [popoverWidth, setPopoverWidth] = useState(null)
  const [popoverHeight, setPopoverHeight] = useState(null)
  const [defaultDirectionInsets] = useState(propsData.defaultDirectionInsets)
  const popRef = useRef(null)
  const closed = useRef(false)

  useEffect(() => {
    if (JSON.stringify(propsData.fromBounds) !== JSON.stringify(fromBounds)) {
      setFromBounds(propsData.fromBounds)
    }
  }, [propsData.fromBounds, fromBounds])

  useImperativeHandle(propsData.refInstance, () => ({
    updateFromBounds: bounds => {
      setFromBounds(bounds)
    },
    close: onCloseCallback => {
      hide({ onCloseCallback })
    },
  }))

  const hide = ({ onCloseCallback }) => {
    // console.log('PullView hide')
    if (closed.current) return true
    closed.current = true
    popRef &&
      popRef.current &&
      popRef.current.close(() => {
        disappearCompleted(onCloseCallback, propsData.onDisappearCompleted)
      })
    return true
  }

  const onPopoverLayout = e => {
    if (
      Platform.OS === 'android' &&
      (popoverWidth !== null || popoverHeight != null)
    ) {
      // android calls many times...
      return
    }
    const { width, height } = e.nativeEvent.layout
    if (width !== popoverWidth || height !== popoverHeight) {
      setPopoverWidth(width)
      setPopoverHeight(height)
    }
  }

  const buildPopoverStyle = () => {
    let {
      popoverStyle,
      direction,
      autoDirection,
      directionInsets,
      align,
      alignInsets,
      showArrow,
      arrow,
    } = propsData
    if (popoverWidth === null || popoverHeight === null) {
      popoverStyle = []
        .concat(popoverStyle)
        .concat({ position: 'absolute', left: 0, top: 0, opacity: 0 })
      if (!showArrow) arrow = 'none'
      else {
        switch (direction) {
          case 'right':
            arrow = 'left'
            break
          case 'left':
            arrow = 'right'
            break
          case 'up':
            arrow = 'bottom'
            break
          default:
            arrow = 'top'
            break
        }
      }
      return { popoverStyle, arrow }
    }

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    let { x, y, width, height } = fromBounds || {}

    if (!x && x !== 0) x = screenWidth / 2
    if (!y && y !== 0) y = screenHeight / 2
    if (!width) width = 0
    if (!height) height = 0
    if (!directionInsets && directionInsets !== 0) { directionInsets = defaultDirectionInsets }
    if (!alignInsets) alignInsets = 0

    // auto direction
    const ph = popoverHeight + directionInsets
    const pw = popoverWidth + directionInsets
    console.log('popoverHeight:', popoverHeight, directionInsets)
    console.log('popoverWidth:', popoverWidth, directionInsets)
    switch (direction) {
      case 'right':
        if (autoDirection && x + width + pw > screenWidth && x >= pw) { direction = 'left' }
        break
      case 'left':
        if (autoDirection && x + width + pw <= screenWidth && x < pw) { direction = 'right' }
        break
      case 'up':
        if (autoDirection && y + height + ph <= screenHeight && y < ph) { direction = 'down' }
        break
      default:
        if (autoDirection && y + height + ph > screenHeight && y >= ph) { direction = 'up' }
        break
    }

    // calculate popover top-left position and arrow type
    let px, py
    switch (direction) {
      case 'right':
        px = x + width + directionInsets
        arrow = 'left'
        break
      case 'left':
        px = x - popoverWidth - directionInsets
        arrow = 'right'
        break
      case 'up':
        py = y - popoverHeight - directionInsets
        arrow = 'bottom'
        break
      default:
        py = y + height + directionInsets
        arrow = 'top'
        break
    }
    if (direction === 'down' || direction === 'up') {
      switch (align) {
        case 'start':
          px = x - alignInsets
          arrow += 'Left'
          break
        case 'center':
          px = x + width / 2 - popoverWidth / 2
          break
        default:
          px = x + width - popoverWidth + alignInsets
          arrow += 'Right'
          break
      }
    } else if (direction === 'right' || direction === 'left') {
      switch (align) {
        case 'end':
          py = y + height - popoverHeight + alignInsets
          arrow += 'Bottom'
          break
        case 'center':
          py = y + height / 2 - popoverHeight / 2
          break
        default:
          py = y - alignInsets
          arrow += 'Top'
          break
      }
    }

    popoverStyle = [].concat(popoverStyle).concat({
      position: 'absolute',
      left: px,
      top: py,
    })
    if (!showArrow) arrow = 'none'
    console.log('{ popoverStyle, arrow }:', popoverStyle, arrow)
    return { popoverStyle, arrow }
  }

  const { paddingCorner, content, children } = propsData
  const { popoverStyle, arrow } = buildPopoverStyle()
  return (
    <PView
      ref={popRef}
      animated={false}
      overlayOpacity={0}
      isBackPress={false}
      overlayPointerEvents="auto"
      onCloseRequest={() => {
        if (propsData.onCloseRequest) {
          propsData.onCloseRequest && propsData.onCloseRequest()
        } else {
          if (!propsData.modal) {
            hide({ onCloseCallback: null })
          }
        }
      }}>
      <Popover
        style={popoverStyle}
        arrow={arrow}
        paddingCorner={paddingCorner}
        onLayout={onPopoverLayout}>
        {content || children}
      </Popover>
    </PView>
  )
}

PopoverView.defaultProps = {
  ...initViewProps,
  overlayOpacity: 0,
  direction: 'down',
  autoDirection: true,
  align: 'end',
  showArrow: true,
}

const Component = PopoverView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props, ref) => (
  <Component {...props} refInstance={ref} />
))
