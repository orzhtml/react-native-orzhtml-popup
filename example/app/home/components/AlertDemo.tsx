import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Alert } from '@app/libs/popup'

const AlertDemo = () => {
  const [tabs] = useState([{
    id: 1,
    name: '完整弹窗',
    onPress: () => {
      Alert('提示', {
        message: '提示内容有确认取消按钮',
        buttons: [{
          text: '取消',
          style: 'cancel',
          onPress: () => {
            console.log('取消')
          },
        }, {
          text: '确定',
          style: 'default',
          onPress: () => {
            console.log('确定')
          },
        }],
      })
    },
  }, {
    id: 2,
    name: '无提示内容',
    onPress: () => {
      Alert('除了标题默认有一个按钮')
    },
  }, {
    id: 3,
    name: '有提示内容',
    onPress: () => {
      Alert('标题', { message: '默认有一个按钮' })
    },
  }, {
    id: 4,
    name: '非模态弹窗',
    onPress: () => {
      Alert('提示非模态弹窗点背景关闭', {
        message: '按钮文字默认',
        onCancel: () => {
          console.log('取消')
        },
        onOk: () => {
          console.log('确定')
        },
        alertOptions: {
          modal: false,
        },
      })
    },
  }, {
    id: 5,
    name: '简化入参',
    onPress: () => {
      Alert('简化按钮调用方式', {
        message: '简化按钮调用方式',
        onCancel: () => {
          console.log('确定')
        },
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

export default AlertDemo
