import React, { FC, forwardRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { pixelSize, popoverArrow } from '../common/Common'

interface IProps {
    [p: string]: any;
    arrow: popoverArrow;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    paddingCorner?: number;
    contentStyle?: StyleProp<ViewStyle>;
    popoverStyle?: StyleProp<ViewStyle>;
    headerStyle?: StyleProp<ViewStyle>;
    arrowStyle?: StyleProp<ViewStyle>;
}

interface PopoverProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const Popover: FC<PopoverProps> = (props) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const filterPopoverStyle = (fs: ViewStyle, includeRadius: boolean) => {
    let {
      borderRadius, borderBottomLeftRadius,
      borderBottomRightRadius, borderTopLeftRadius,
      borderTopRightRadius,
      ...others
    } = fs
    let style = includeRadius ? {
      borderRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      ...others,
    } : { ...others }
    return filterContentStyle(style)
  }

  const filterContentStyle = (fs: ViewStyle) => {
    for (let key in fs) {
      if (fs[key] === undefined) {
        delete fs[key]
      }
    }
    return fs
  }

  const buildStyle = () => {
    let { style, arrow, paddingCorner, headerStyle, arrowStyle, contentStyle, popoverStyle } = props

    let _style: ViewStyle = {
      backgroundColor: '#fff',
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius: 4,
      borderWidth: pixelSize,
    }

    let fs = StyleSheet.flatten([_style, style])
    let { backgroundColor, borderColor, borderWidth } = fs

    let arrowSize = 7 // Square side length
    let halfSquareSize = Math.sqrt(arrowSize * arrowSize * 2) / 2 // The half-length of the square diagonal: sqrt(7^2 + 7^2) / 2 = 4.95
    halfSquareSize = Math.ceil(halfSquareSize / pixelSize) * pixelSize
    let headerSize = halfSquareSize + (borderWidth || 0)
    let headerPadding = headerSize - arrowSize / 2 // Let the center of square on the edge: 5 - (7 / 2) = 1.5
    let headerPaddingCorner = paddingCorner || 8
    let contentPadding = halfSquareSize

    let headerLayouts = {
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
    let arrowLayouts = {
      none: {},
      topLeft: { transform: [{ rotate: '45deg' }] },
      top: { transform: [{ rotate: '45deg' }] },
      topRight: { transform: [{ rotate: '45deg' }] },
      rightTop: { transform: [{ rotate: '135deg' }] },
      right: { transform: [{ rotate: '135deg' }] },
      rightBottom: { transform: [{ rotate: '135deg' }] },
      bottomRight: { transform: [{ rotate: '225deg' }] },
      bottom: { transform: [{ rotate: '225deg' }] },
      bottomLeft: { transform: [{ rotate: '225deg' }] },
      leftBottom: { transform: [{ rotate: '315deg' }] },
      left: { transform: [{ rotate: '315deg' }] },
      leftTop: { transform: [{ rotate: '315deg' }] },
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

    if (!arrow) arrow = 'none'
    let useArrow = arrow
    switch (arrow) {
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

    return {
      popoverStyle: [filterPopoverStyle(fs, useArrow === 'none'), {
        backgroundColor: useArrow === 'none' ? '#fff' : 'rgba(0, 0, 0, 0)', // Transparent background will cause a warning at debug mode
      }, popoverLayouts[useArrow], popoverStyle],
      contentStyle: [filterContentStyle(fs), contentStyle],
      headerStyle: [{
        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }, headerLayouts[useArrow], headerStyle],
      arrowStyle: [{
        backgroundColor,
        width: arrowSize,
        height: arrowSize,
        borderColor,
        borderTopWidth: borderWidth,
        borderLeftWidth: borderWidth,
      }, arrowLayouts[useArrow], arrowStyle],
    }
  }

  const onLayout = (e: { nativeEvent: { layout: any } }) => {
    let _layout = e.nativeEvent.layout
    if (_layout.width !== width || _layout.height !== height) {
      setWidth(width)
      setHeight(height)
    }
    props.onLayout && props.onLayout(e)
  }

  let { style, children, arrow, paddingCorner, ...others } = props
  let { popoverStyle, contentStyle, headerStyle, arrowStyle } = buildStyle()

  return (
    <View style={popoverStyle} onLayout={onLayout} {...others}>
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

const Component = Popover
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
