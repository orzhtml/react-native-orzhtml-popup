
import React, { useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { ActionPopover } from '@app/libs/popup'

const ActionPopoverDemo = () => {
  const _shareRef = useRef<TouchableOpacity>(null)

  const _onLongPress = () => {
    _shareRef.current?.measure(
      (width: number, height: number, pageX: number, pageY: number) => {
        let items = [
          {
            title: '分享微信',
            type: 'friend',
            onPress: async () => {
              console.log('shareToSession')
            },
          },
          {
            title: '分享朋友圈',
            type: 'share',
            onPress: async () => {
              console.log('shareToTimeline')
            },
          },
        ]
        ActionPopover.show(
          { x: pageX, y: pageY, width, height },
          items,
        )
      },
    )
  }

  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingRight: 10,
      marginTop: 20,
      position: 'relative',
    }}>
      <TouchableOpacity
        ref={_shareRef}
        style={{
          borderWidth: 1,
          borderColor: '#999',
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginLeft: 10,
          marginBottom: 10,
        }}
        onLongPress={_onLongPress}
      >
        <Text style={{ color: '#999' }}>长按显示分享按钮</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ActionPopoverDemo
