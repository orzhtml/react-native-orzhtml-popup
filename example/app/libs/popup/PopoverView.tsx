import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle, FC, useCallback } from 'react'
import { Platform, Dimensions, StyleProp, ViewStyle, LayoutChangeEvent, StyleSheet, View } from 'react-native'

import { disappearCompleted, fromBoundsType, initViewProps, IProps, popoverArrow, popRefType } from './common/Common'
import PView from './PView'
import Popover from './popover'

interface CProps extends IProps {
    children?: React.ReactNode,
    content?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    onDisappearCompleted?: () => void,
    onAppearCompleted?: () => void,
    onCloseRequest?: () => void,
    direction: 'down' | 'up' | 'right' | 'left',
    align: 'end' | 'start' | 'center' | 'right' | 'left',
    arrow: popoverArrow,
    autoDirection: boolean,
    showArrow: boolean,
    paddingCorner?: number,
    directionInsets?: number,
    defaultDirectionInsets: number,
    alignInsets?: number,
    fromBounds?: fromBoundsType,
}

interface PopoverProps extends CProps {
    refInstance: React.ForwardedRef<any>;
}

const PopoverView: FC<PopoverProps> = props => {
  const [fromBounds, setFromBounds] = useState(props.fromBounds)
  const [popoverWidth, setPopoverWidth] = useState(0)
  const [popoverHeight, setPopoverHeight] = useState(0)
  const [defaultDirectionInsets] = useState(props.defaultDirectionInsets)
  const popRef = useRef<popRefType>(null)
  const closed = useRef(false)

  useEffect(() => {
    if (JSON.stringify(props.fromBounds) !== JSON.stringify(fromBounds)) {
      setFromBounds(props.fromBounds)
    }
  }, [props.fromBounds, fromBounds])

  useImperativeHandle(props.refInstance, () => ({
    updateFromBounds: (bounds: any) => {
      setFromBounds(bounds)
    },
    close: (onCloseCallback: () => void) => {
      hide(onCloseCallback)
    },
  }))

  const hide = (onCloseCallback?: () => void) => {
    if (closed.current) return true
    closed.current = true
    popRef.current?.close(() => {
      disappearCompleted(onCloseCallback, props.onDisappearCompleted)
    })
    return true
  }

  const onPopoverLayout = useCallback((e: LayoutChangeEvent) => {
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
  }, [popoverWidth, popoverHeight])

  const buildPopoverStyle = () => {
    let {
      style,
      direction,
      autoDirection,
      directionInsets,
      align,
      alignInsets,
      showArrow,
      arrow,
    } = props
    let popoverStyle: ViewStyle[] = [StyleSheet.flatten(style)]

    let _arrow = arrow
    if (popoverWidth === 0 || popoverHeight === 0) {
      popoverStyle = popoverStyle.concat({
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0,
      })
      if (!showArrow) _arrow = 'none'
      else {
        switch (direction) {
          case 'right':
            _arrow = 'left'
            break
          case 'left':
            _arrow = 'right'
            break
          case 'up':
            _arrow = 'bottom'
            break
          default:
            _arrow = 'top'
            break
        }
      }

      return { popoverStyle, arrow: _arrow }
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
    let px: number = 0
    let py: number = 0
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
          _arrow = _arrow === 'top' ? 'topLeft' : 'bottomLeft'
          break
        case 'center':
          px = x + width / 2 - popoverWidth / 2
          break
        default:
          px = x + width - popoverWidth + alignInsets
          _arrow = _arrow === 'top' ? 'topRight' : 'bottomRight'
          break
      }
    } else if (direction === 'right' || direction === 'left') {
      switch (align) {
        case 'end':
          py = y + height - popoverHeight + alignInsets
          _arrow = _arrow === 'right' ? 'rightBottom' : 'leftBottom'
          break
        case 'center':
          py = y + height / 2 - popoverHeight / 2
          break
        default:
          py = y - alignInsets
          _arrow = _arrow === 'right' ? 'rightTop' : 'leftTop'
          break
      }
    }

    popoverStyle = popoverStyle.concat({
      position: 'absolute',
      left: px,
      top: py,
    })
    if (!showArrow) _arrow = 'none'
    return { popoverStyle, arrow: _arrow }
  }

  const { paddingCorner, content, children } = props
  const { popoverStyle, arrow } = buildPopoverStyle()

  return (
    <PView
      ref={popRef}
      animated={false}
      overlayOpacity={0}
      isBackPress={false}
      overlayPointerEvents="auto"
      onCloseRequest={() => {
        if (props.onCloseRequest) {
          props.onCloseRequest && props.onCloseRequest()
        } else {
          if (!props.modal) {
            hide()
          }
        }
      }}
    >
      <Popover
        style={popoverStyle}
        arrow={arrow}
        paddingCorner={paddingCorner}
        onLayout={onPopoverLayout}
      >
        {content || children}
      </Popover>
    </PView>
  )
}

const Component = PopoverView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    overlayOpacity: 0,
    autoDirection: true,
    showArrow: true,
    direction: 'down',
    align: 'end',
    arrow: 'bottom',
    defaultDirectionInsets: 0,
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
