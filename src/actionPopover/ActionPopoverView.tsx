import React, { FC, useRef, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { disappearCompleted, initViewProps } from '../common/Common'
import type { fromBoundsType, IProps, PopoverHandleRef } from '../common/Type'
import PopoverView from '../PopoverView'
import Item from './ActionPopoverItem'

interface CProps extends IProps {
    onDisappearCompleted?: () => void,
    style?: StyleProp<ViewStyle>,
    items: {
      type?: string,
      title: string,
      onPress: (item: { type: string, title: string }) => void,
    }[],
    direction: 'down' | 'up' | 'right' | 'left',
    align: 'end' | 'start' | 'center' | 'right' | 'left',
    showArrow: boolean,
    fromBounds?: fromBoundsType,
}

const ActionPopoverView: FC<CProps> = (props) => {
  const [defaultDirectionInsets] = useState(4)
  const PopoverRef = useRef<PopoverHandleRef>(null)

  const onItemPress = (item: {
    type?: string;
    title: string;
    onPress: (itm: { type: string; title: string }) => void;
  }) => {
    item.onPress &&
      item.onPress({
        type: item.type || '',
        title: item.title,
      })
    PopoverRef.current?.close(() => {
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
      ref={PopoverRef}
      defaultDirectionInsets={defaultDirectionInsets}
    >
      {renderContent()}
    </PopoverView>
  )
}

function ActionPopover (props: Partial<CProps>) {
  const initProps: CProps = {
    ...initViewProps,
    items: [],
    direction: 'up',
    align: 'center',
    showArrow: true,
    ...props,
  }

  return (
    <ActionPopoverView {...initProps} />
  )
}

export default ActionPopover
