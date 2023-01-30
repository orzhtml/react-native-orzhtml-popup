import React, { FC, forwardRef, useState } from 'react'
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { arrowLayouts, filterContentStyle, filterPopoverStyle, headerLayoutsType, pixelSize, popoverArrow } from '../common/Common'

interface IProps {
  arrow: popoverArrow;
  children?: React.ReactNode;
  paddingCorner?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  arrowStyle?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}

interface PopoverProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const PopoverView: FC<PopoverProps> = (props) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const buildStyle = () => {
    let { style, contentStyle, arrow, paddingCorner } = props
    let fStyle = StyleSheet.flatten(style)
    const fContentStyle = StyleSheet.flatten(contentStyle)
    console.log('fContentStyle:', contentStyle)
    let _style = [{
      backgroundColor: '#fff',
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius: 4,
      borderWidth: pixelSize,
    }, fStyle]
    let _contentStyle = [{
      backgroundColor: '#fff',
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius: 4,
      borderWidth: pixelSize,
    }, fStyle]

    let fs = StyleSheet.flatten(_style)
    const fsCnt = StyleSheet.flatten(_contentStyle)
    let { backgroundColor, borderColor, borderRadius, borderWidth } = fs

    let arrowSize = 7 // Square side length
    let halfSquareSize = Math.sqrt(arrowSize * arrowSize * 2) / 2 // The half-length of the square diagonal: sqrt(7^2 + 7^2) / 2 = 4.95
    halfSquareSize = Math.ceil(halfSquareSize / pixelSize) * pixelSize
    let headerSize = halfSquareSize + (borderWidth || 0)
    let headerPadding = headerSize - arrowSize / 2 // Let the center of square on the edge: 5 - (7 / 2) = 1.5
    let headerPaddingCorner = paddingCorner || 8
    let contentPadding = halfSquareSize

    let headerLayouts: headerLayoutsType = {
      none: {},
      topLeft: { top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding, alignItems: 'flex-start', paddingLeft: headerPaddingCorner },
      top: { top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding, alignItems: 'center' },
      topRight: { top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding, alignItems: 'flex-end', paddingRight: headerPaddingCorner },
      rightTop: { top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: headerPaddingCorner },
      right: { top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end', justifyContent: 'center' },
      rightBottom: { top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: headerPaddingCorner },
      bottomRight: { bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: headerPaddingCorner },
      bottom: { bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding, alignItems: 'center', justifyContent: 'flex-end' },
      bottomLeft: { bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding, alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: headerPaddingCorner },
      leftBottom: { top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start', justifyContent: 'flex-end', paddingBottom: headerPaddingCorner },
      left: { top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start', justifyContent: 'center' },
      leftTop: { top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: headerPaddingCorner },
    }

    let popoverLayouts = {
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
    let _arrow: popoverArrow = arrow
    if (!_arrow) _arrow = 'none'
    let useArrow = _arrow
    switch (_arrow) {
      case 'topLeft':
      case 'topRight':
        if (headerPaddingCorner + contentPadding > width / 2) useArrow = 'top'
        break
      case 'rightTop':
      case 'rightBottom':
        if (headerPaddingCorner + contentPadding > height / 2) useArrow = 'right'
        break
      case 'bottomRight':
      case 'bottomLeft':
        if (headerPaddingCorner + contentPadding > width / 2) useArrow = 'bottom'
        break
      case 'leftBottom':
      case 'leftTop':
        if (headerPaddingCorner + contentPadding > height / 2) useArrow = 'left'
        break
    }

    let _headerStyle = Object.assign({
      position: 'absolute',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }, headerLayouts[useArrow])
    let _arrowStyle = Object.assign({
      backgroundColor,
      width: arrowSize,
      height: arrowSize,
      borderColor,
      borderTopWidth: borderWidth,
      borderLeftWidth: borderWidth,
    }, arrowLayouts[useArrow])
    let _contentStyles = filterContentStyle(fsCnt)
    let _popoverStyle = [filterPopoverStyle(fs, useArrow === 'none'), {
      backgroundColor: useArrow === 'none' ? '#fff' : 'rgba(0, 0, 0, 0)', // Transparent background will cause a warning at debug mode
    }, popoverLayouts[useArrow]]
    console.log('_popoverStyle:', _popoverStyle)
    console.log('_contentStyles:', _contentStyles)
    console.log('_headerStyle:', _headerStyle)
    console.log('_arrowStyle:', _arrowStyle)

    return {
      popoverStyle: _popoverStyle,
      contentStyle: _contentStyles,
      headerStyle: _headerStyle,
      arrowStyle: _arrowStyle,
    }
  }

  const onLayout = (e: LayoutChangeEvent) => {
    let _layout = e.nativeEvent.layout
    if (_layout.width !== width || _layout.height !== height) {
      setWidth(_layout.width)
      setHeight(_layout.height)
    }
    props.onLayout && props.onLayout(e)
  }

  let { style, children, arrow, paddingCorner, ...others } = props
  let { popoverStyle, contentStyle, headerStyle, arrowStyle } = buildStyle()

  return (
    <View {...others} style={popoverStyle} onLayout={onLayout}>
      <View style={contentStyle}>
        {children}
      </View>
      {!arrow || arrow === 'none' ? null : (
        <View style={headerStyle}><View style={arrowStyle} /></View>
      )}
    </View>
  )
}

const Component = PopoverView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef(({
  arrow = 'none',
  ...other
}: Partial<IProps>, ref) => {
  const initProps = {
    arrow,
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
