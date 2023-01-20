import React, { FC, forwardRef, useRef, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { disappearCompleted, fromBoundsType, OverlayPointerEvents, popRefType } from '../common/Common'
import PopoverView from '../PopoverView'

import Item from './ActionPopoverItem'

interface IProps {
    modal: boolean,
    animated: boolean,
    overlayPointerEvents: OverlayPointerEvents,
    isBackPress: boolean,
    overlayOpacity: number,
    onDisappearCompleted?: () => void,
    style?: StyleProp<ViewStyle>,
    items: {
      type?: string,
      title: string,
      onPress: () => void,
    }[],
    direction: 'down' | 'up' | 'right' | 'left',
    align: 'end' | 'start' | 'center' | 'right' | 'left',
    showArrow: boolean,
    fromBounds?: fromBoundsType,
}

interface ActionPopoverProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const ActionPopoverView: FC<ActionPopoverProps> = (props) => {
  console.log('props:', props)
  const [defaultDirectionInsets] = useState(4)
  const popoverRef = useRef<popRefType>(null)

  const onItemPress = (item: { [x: string]: any; onPress?: any }) => {
    item.onPress && item.onPress()
    popoverRef.current && popoverRef.current.close(() => {
      disappearCompleted(props.onDisappearCompleted)
    })
  }

  const buildPopoverStyle = () => {
    let popoverStyle: ViewStyle = {
      backgroundColor: 'rgba(64, 64, 64, 0.9)', // 'rgba(0, 0, 0, 0.9)',
      paddingVertical: 0,
      paddingHorizontal: 4,
      borderRadius: 8,
      flexDirection: 'row',
    }
    let _style = StyleSheet.flatten(props.style)
    return StyleSheet.compose(popoverStyle, _style)
  }

  const renderContent = () => {
    let { items } = props
    let list = []
    for (let i = 0; i < items.length; ++i) {
      let item = items[i]
      list.push(
        <Item
          key={'item' + i}
          title={item.title}
          leftSeparator={i !== 0}
          onPress={() => onItemPress(item)}
        />,
      )
    }
    return list
  }

  const _popoverStyle = buildPopoverStyle()

  return (
    <PopoverView
      {...props}
      ref={popoverRef}
      style={_popoverStyle}
      defaultDirectionInsets={defaultDirectionInsets}
    >
      {renderContent()}
    </PopoverView>
  )
}

const Component = ActionPopoverView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef(({
  overlayPointerEvents = 'auto',
  direction = 'up',
  align = 'center',
  showArrow = true,
  ...other
}: Partial<IProps>, ref) => {
  const initProps = {
    modal: false,
    animated: true,
    overlayPointerEvents,
    isBackPress: true,
    overlayOpacity: 0.55,
    useDark: false,
    items: [],
    direction,
    align,
    showArrow,
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
