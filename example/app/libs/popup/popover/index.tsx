import React, { FC, forwardRef, useCallback, useState } from 'react'
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { arrowLayouts, filterContentStyle, filterPopoverStyle, headerLayoutsType, pixelSize, popoverArrow } from '../common/Common'

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

interface PopoverProps extends CProps {
    refInstance: React.ForwardedRef<any>;
}

const PopoverView: FC<PopoverProps> = (props) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const buildStyle = () => {
    let { style, arrow, paddingCorner } = props
    let fStyle = StyleSheet.flatten(style)
    let _style = [{
      backgroundColor: '#fff',
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius: 4,
      borderWidth: pixelSize,
    }, fStyle]

    let fs = StyleSheet.flatten(_style)
    let { backgroundColor, borderColor, borderRadius, borderWidth } = fs
    let arrowSize = 7 // Square side length
    let halfSquareSize = Math.sqrt(arrowSize * arrowSize * 2) / 2 // The half-length of the square diagonal: sqrt(7^2 + 7^2) / 2 = 4.95
    halfSquareSize = Math.ceil(halfSquareSize / pixelSize) * pixelSize
    let headerSize = halfSquareSize + (borderWidth || 0)
    let headerPadding = headerSize - arrowSize / 2 // Let the center of square on the edge: 5 - (7 / 2) = 1.5
    let headerPaddingCorner = paddingCorner
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
    let _arrow = arrow
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

    let popoverStyle = [filterPopoverStyle(fs, useArrow === 'none'), {
      backgroundColor: useArrow === 'none' ? '#fff' : 'rgba(0, 0, 0, 0)', // Transparent background will cause a warning at debug mode
    }].concat(popoverLayouts[useArrow])
    let fContentStyle = StyleSheet.flatten(props.contentStyle)
    let { position, left, right, bottom, top, ...fCOther } = fs
    let contentStyle = filterContentStyle({ ...fCOther, ...fContentStyle })
    let headerStyle = Object.assign({
      position: 'absolute',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }, headerLayouts[useArrow], props.headerStyle)
    let arrowStyle = Object.assign({
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

const Component = PopoverView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    arrow: 'none',
    paddingCorner: 8,
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
