
import React, { useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { ActionPopover } from '@app/libs/popup'

const ActionPopoverDemo = () => {
  const _shareRef = useRef<TouchableOpacity>(null)

  const _onLongPress = () => {
    _shareRef.current?.measure(
      (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        ActionPopover.show(
          { x: pageX, y: pageY, width, height },
          [
            {
              title: '分享微信',
              type: 'friend',
              onPress: (item) => {
                console.log('shareToSession:', item)
              },
            },
            {
              title: '分享朋友圈',
              type: 'share',
              onPress: (item) => {
                console.log('shareToTimeline:', item)
              },
            },
          ],
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
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight: 10,
        marginTop: 20,
      }}>
        <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 200, marginLeft: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <Text ref={_shareRef} onLongPress={_onLongPress}>重点提示</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ActionPopoverDemo
