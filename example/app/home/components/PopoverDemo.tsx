import React from 'react'
import { Text, View } from 'react-native'

import { Popover } from '@app/libs/popup2'

const PopoverDemo = () => {
  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingRight: 10,
      marginTop: 20,
    }}>
      <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 200, marginLeft: 20 }}>
          <Popover
            contentStyle={[{
              borderColor: 'red',
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 12,
              paddingRight: 12,
            }]}
            arrowStyle={{
              borderColor: 'red',
            }}
            arrow='bottom'
            paddingCorner={16}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#FFAC00',
            }}>保存在app端 实时查看</Text>
          </Popover>
          <View style={{ alignItems: 'center' }}><Text>重点提示</Text></View>
        </View>
        <View style={{ width: 200, marginLeft: 20, marginTop: 20 }}>
          <Popover
            contentStyle={[{
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderColor: 'rgba(0,0,0,0.8)',
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 12,
              paddingRight: 12,
            }]}
            arrowStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderColor: 'rgba(0,0,0,0.8)',
            }}
            arrow='bottom'
            paddingCorner={16}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#FFAC00',
            }}>保存在app端 实时查看</Text>
          </Popover>
          <View style={{ alignItems: 'center' }}><Text>改变颜色</Text></View>
        </View>
      </View>
    </View>
  )
}

export default PopoverDemo
