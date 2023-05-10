import React, { FC, useCallback, useState } from 'react'
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { arrowLayouts, filterContentStyle, filterPopoverStyle, pixelSize } from '../common/Common'
import type { popoverArrow } from '../common/Type'

interface CProps {
    children?: React.ReactNode;
    arrow: popoverArrow;
    paddingCorner: number;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    headerStyle?: StyleProp<ViewStyle>;
    arrowStyle?: StyleProp<ViewStyle>;
    onLayout?: (event: LayoutChangeEvent) => void;
}

const PopoverView: FC<CProps> = (props) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const buildStyle = () => {
    const { style, arrow, paddingCorner } = props
    const fStyle = StyleSheet.flatten(style)
    const _style = [{
      backgroundColor: '#fff',
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius: 4,
      borderWidth: pixelSize,
    }, fStyle]

    const fs = StyleSheet.flatten(_style)
    const { backgroundColor, borderColor, borderRadius, borderWidth } = fs
    const arrowSize = 7 // Square side length
    let halfSquareSize = Math.sqrt(arrowSize * arrowSize * 2) / 2 // The half-length of the square diagonal: sqrt(7^2 + 7^2) / 2 = 4.95
    halfSquareSize = Math.ceil(halfSquareSize / pixelSize) * pixelSize
    const headerSize = halfSquareSize + (borderWidth || 0)
    const headerPadding = headerSize - arrowSize / 2 // Let the center of square on the edge: 5 - (7 / 2) = 1.5
    const headerPaddingCorner = paddingCorner
    const contentPadding = halfSquareSize
    const headerTopLayout = { top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding }
    const headerRightLayout = { top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end' }
    const headerBottom = { bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding }
    const headerLeft = { top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start' }
    const headerLayouts = {
      none: {},
      topLeft: { ...headerTopLayout, alignItems: 'flex-start', paddingLeft: headerPaddingCorner },
      top: { ...headerTopLayout, alignItems: 'center' },
      topRight: { ...headerTopLayout, alignItems: 'flex-end', paddingRight: headerPaddingCorner },
      rightTop: { ...headerRightLayout, justifyContent: 'flex-start', paddingTop: headerPaddingCorner },
      right: { ...headerRightLayout, justifyContent: 'center' },
      rightBottom: { ...headerRightLayout, justifyContent: 'flex-end', paddingBottom: headerPaddingCorner },
      bottomRight: { ...headerBottom, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: headerPaddingCorner },
      bottom: { ...headerBottom, alignItems: 'center', justifyContent: 'flex-end' },
      bottomLeft: { ...headerBottom, alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: headerPaddingCorner },
      leftBottom: { ...headerLeft, justifyContent: 'flex-end', paddingBottom: headerPaddingCorner },
      left: { ...headerLeft, justifyContent: 'center' },
      leftTop: { ...headerLeft, justifyContent: 'flex-start', paddingTop: headerPaddingCorner },
    }
    const popoverLayouts = {
      none: {},
      topLeft: { paddingTop: contentPadding },
      top: { paddingTop: contentPadding },
      topRight: { paddingTop: contentPadding },
      rightTop: { paddingRight: contentPadding },
      right: { paddingRight: contentPadding },
      rightBottom: { paddingRight: contentPadding },
      bottomRight: { paddingBottom: contentPadding },
      bottom: { paddingBottom: contentPadding },
      bottomLeft: { paddingBottom: contentPadding },
      leftBottom: { paddingLeft: contentPadding },
      left: { paddingLeft: contentPadding },
      leftTop: { paddingLeft: contentPadding },
    }
    let useArrow = arrow || 'none'
    const totalPadding = headerPaddingCorner + contentPadding
    switch (arrow) {
      case 'topLeft':
      case 'topRight':
        if (totalPadding > width / 2) useArrow = 'top'
        break
      case 'rightTop':
      case 'rightBottom':
        if (totalPadding > height / 2) useArrow = 'right'
        break
      case 'bottomRight':
      case 'bottomLeft':
        if (totalPadding > width / 2) useArrow = 'bottom'
        break
      case 'leftBottom':
      case 'leftTop':
        if (totalPadding > height / 2) useArrow = 'left'
        break
    }

    const popoverStyle = [filterPopoverStyle(fs, useArrow === 'none'), {
      backgroundColor: useArrow === 'none' ? '#fff' : 'rgba(0, 0, 0, 0)', // Transparent background will cause a warning at debug mode
    }].concat(popoverLayouts[useArrow])
    const fContentStyle = StyleSheet.flatten(props.contentStyle)
    const { position, left, right, bottom, top, ...fCOther } = fs
    const contentStyle = filterContentStyle({ ...fCOther, ...fContentStyle })
    const headerStyle = Object.assign({
      position: 'absolute',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }, headerLayouts[useArrow], props.headerStyle)
    const arrowStyle = Object.assign({
      backgroundColor,
      width: arrowSize,
      height: arrowSize,
      borderColor,
      borderTopWidth: borderWidth,
      borderLeftWidth: borderWidth,
    }, arrowLayouts[useArrow], props.arrowStyle)

    return { popoverStyle: StyleSheet.flatten(popoverStyle), contentStyle, headerStyle, arrowStyle }
  }

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    let _layout = e.nativeEvent.layout
    if (_layout.width !== width || _layout.height !== height) {
      setWidth(_layout.width)
      setHeight(_layout.height)
    }
    props.onLayout && props.onLayout(e)
  }, [width, height])

  let { children, arrow, paddingCorner, ...others } = props
  let { popoverStyle, contentStyle, headerStyle, arrowStyle } = buildStyle()

  return (
    <View
      {...others}
      style={popoverStyle}
      onLayout={onLayout}
    >
      <View style={contentStyle}>
        {children}
      </View>
      {!arrow || arrow === 'none' ? null : (
        <View style={headerStyle}>
          <View style={arrowStyle} />
        </View>
      )}
    </View>
  )
}

function Popover (props: Partial<CProps>) {
  const initProps: CProps = {
    arrow: 'none',
    paddingCorner: 8,
    ...props,
  }

  return (
    <PopoverView {...initProps} />
  )
}

export default Popover
