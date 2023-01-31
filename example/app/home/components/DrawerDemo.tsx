import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Drawer } from '@app/libs/popup'

const DrawerDemo = () => {
  const [tabs] = useState([{
    id: 1,
    name: 'show Drawer',
    onPress: () => {
      Drawer.open({
        view: _renderDrawerMenu(),
        onClose: () => {
          console.log('onClose:')
        },
      })
    },
  }])

  const _renderDrawerMenu = () => {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'red',
        width: 300,
        paddingTop: 200,
      }}>
        <Text>侧栏</Text>
      </View>
    )
  }

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

export default DrawerDemo
