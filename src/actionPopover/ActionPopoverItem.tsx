import React, { FC, forwardRef } from 'react'
import { Text, TouchableOpacity, StyleProp, ViewStyle, TouchableOpacityProps, StyleSheet } from 'react-native'

import { pixelSize } from '../common/Common'
import { scaleSize } from '../common/SetSize'

interface IProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    title?: string | number | React.ReactNode,
    leftSeparator?: boolean,
    rightSeparator?: boolean,
}

interface ActionSheetProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const ActionPopoverItem: FC<ActionSheetProps> = (props) => {
  const renderTitle = () => {
    let { title } = props

    if ((title || title === '' || title === 0) && !React.isValidElement(title)) {
      let textStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: '#fff',
        fontSize: scaleSize(14),
      }
      title = (<Text style={textStyle} numberOfLines={1}>{title}</Text>)
    }

    return title
  }

  let { style, title, leftSeparator, rightSeparator, ...others } = props

  let _style: ViewStyle = {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: '#ccc',
    borderLeftWidth: leftSeparator ? pixelSize : 0,
    borderRightWidth: rightSeparator ? pixelSize : 0,
  }
  let fs = StyleSheet.flatten(style)

  return (
    <TouchableOpacity style={[_style, fs]} {...others}>
      {renderTitle()}
    </TouchableOpacity>
  )
}

const Component = ActionPopoverItem
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<IProps>, ref) => {
  return (
    <Component {...props} refInstance={ref} />
  )
})
