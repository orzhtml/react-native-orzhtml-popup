import React, { FC, forwardRef, useRef, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { disappearCompleted, fromBoundsType, initViewProps, IProps, popRefType } from '../common/Common'
import PopoverView from '../PopoverView'
import Item from './ActionPopoverItem'

interface CProps extends IProps {
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

interface ActionPopoverProps extends CProps {
    refInstance: React.ForwardedRef<any>;
}

const ActionPopoverView: FC<ActionPopoverProps> = (props) => {
  const [defaultDirectionInsets] = useState(4)
  const popoverRef = useRef<popRefType>(null)
  const onItemPress = (item: { [x: string]: any; onPress?: () => void }) => {
    item.onPress && item.onPress()
    popoverRef.current && popoverRef.current.close(() => {
      disappearCompleted(props.onDisappearCompleted)
    })
  }

  const buildPopoverStyle = () => {
    let _style = StyleSheet.flatten(props.style)
    let popoverStyle: ViewStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      paddingVertical: 0,
      paddingHorizontal: 4,
      borderRadius: 8,
      flexDirection: 'row',
      ..._style,
    }
    return popoverStyle
  }

  const renderContent = () => {
    let { items } = props
    let list: React.ReactNode[] = []
    items?.map((item, index) => {
      list.push(
        <Item
          key={'item' + index}
          title={item.title}
          leftSeparator={index !== 0}
          onPress={() => onItemPress(item)}
        />,
      )
    })

    return list
  }

  return (
    <PopoverView
      {...props}
      style={buildPopoverStyle()}
      ref={popoverRef}
      defaultDirectionInsets={defaultDirectionInsets}
    >
      {renderContent()}
    </PopoverView>
  )
}

const Component = ActionPopoverView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    items: [],
    direction: 'up',
    align: 'center',
    showArrow: true,
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
