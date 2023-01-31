import React, { useCallback, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'

import { PullPicker } from '@app/libs/popup'

const PullPickerDemo = () => {
  const nameList = useRef([{ label: '小明', value: '01' }, { label: '小红', value: '02' }])
  const [state, setState] = useSingleState({
    nameValue: '',
  })
  const [tabs] = useState([{
    id: 1,
    name: 'Pull Picker Demo',
    onPress: () => {
      handleShowPull()
    },
  }])

  const handleShowPull = () => {
    console.log('state.nameValue:', state.nameValue)

    PullPicker.show({
      items: nameList.current,
      value: state.nameValue,
      confirm: (item: any, index: any) => {
        console.log('item, index:', item, index)
        setState({ nameValue: item })
      },
      // cancel: () => { console.log('cancel') },
      // options: {
      //   label: 'instNm',
      // },
    })
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
      <Text>名字: {nameList.current.filter(item => item.value === state.nameValue)[0]?.label}</Text>
    </View>
  )
}

export default PullPickerDemo
