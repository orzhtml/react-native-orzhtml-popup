import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Toast } from '@app/libs/popup'

const ToastDemo = () => {
  const [tabs] = useState([{
    id: 1,
    name: 'Toast.message',
    onPress: () => {
      Toast.message('小明')
    },
  }, {
    id: 2,
    name: 'Toast.show',
    onPress: () => {
      Toast.show({
        text: '小李',
      })
    },
  }, {
    id: 3,
    name: 'Toast.success',
    onPress: () => {
      Toast.success('提示 success')
    },
  }])
  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingRight: 10,
      marginTop: 20,
    }}>
      {
        tabs.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id + index}
              style={{
                borderWidth: 1,
                borderColor: '#999',
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginLeft: 10,
                marginBottom: 10,
              }}
              onPress={item.onPress}
            >
              <Text style={{ color: '#999' }}>{item.name}</Text>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}

export default ToastDemo
