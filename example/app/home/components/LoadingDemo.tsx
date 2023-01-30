import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Loading } from '@app/libs/popup'

function mock (data: any, t: any) {
  return new Promise(function (resolve) {
    t = t || Math.random() * 1500
    setTimeout(resolve, t, data)
  })
}

const LoadingDemo = () => {
  const [tabs] = useState([{
    id: 1,
    name: 'Loading 正常用法',
    onPress: async () => {
      Loading.show()
      let res = await mock('xx', 3000)
      Loading.hide()
    },
  }, {
    id: 2,
    name: '加载过程中改变提示内容',
    onPress: () => {
      Loading.show()
      setTimeout(() => {
        Loading.loadingRef?.updateTitle('加载中...')
      }, 1000)
      mock('xx', 3000).then(res => {
        Loading.hide()
      }).catch(e => {
        Loading.hide()
        console.log(e)
      })
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

export default LoadingDemo
