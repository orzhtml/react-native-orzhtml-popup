import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { ActionSheet } from '@app/libs/popup'

const ActionSheetDemo = () => {
  const [name, setName] = useState('')
  const [tabs] = useState([{
    id: 1,
    name: 'Action Sheet Demo',
    onPress: () => {
      ActionSheet.show({
        items: [
          { label: '小明1', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明3', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明5', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明7', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明9', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明11', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明13', value: '01' }, { label: '小红', value: '02' },
          // { label: '小明15', value: '01' }, { label: '小红', value: '02' },
      ],
        confirm: (item: any, index: any) => {
          console.log('item, index:', item, index)
          setName(item.label)
        },
        // cancel: () => { console.log('cancel') },
        // options: {
        //   label: 'instNm',
        // },
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
      <Text>名字: {name}</Text>
    </View>
  )
}

export default ActionSheetDemo
