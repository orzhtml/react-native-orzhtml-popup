import React, { useRef, useState } from 'react'

import { initViewProps, disappearCompleted } from '../libs/Common'
import PopoverView from '../PopoverView'
import Item from './ActionPopoverItem'

const ActionPopoverView = (props) => {
  console.log('props:', props)
  const [defaultDirectionInsets] = useState(4)
  const popoverRef = useRef(null)

  const onItemPress = (item) => {
    item.onPress && item.onPress()
    popoverRef.current && popoverRef.current.close(() => {
      disappearCompleted(props.onDisappearCompleted)
    })
  }

  const buildPopoverStyle = () => {
    let popoverStyle = [{
      backgroundColor: 'rgba(64, 64, 64, 0.9)', // 'rgba(0, 0, 0, 0.9)',
      paddingVertical: 0,
      paddingHorizontal: 4,
      borderRadius: 8,
      flexDirection: 'row',
    }].concat(popoverStyle)
    return { popoverStyle }
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

  return (
    <PopoverView
      {...props}
      ref={popoverRef}
      {...buildPopoverStyle()}
      defaultDirectionInsets={defaultDirectionInsets}
    >
      {renderContent()}
    </PopoverView>
  )
}

ActionPopoverView.defaultProps = {
  ...initViewProps,
  direction: 'up',
  align: 'center',
  showArrow: true,
}

export default ActionPopoverView
