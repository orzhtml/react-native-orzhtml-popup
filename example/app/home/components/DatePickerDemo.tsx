import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'
import dayjs from 'dayjs'

import { DatePicker } from '@app/libs/popup2'

const DatePickerDemo = () => {
  const [state, setState] = useSingleState<{
    startDate?: string,
    tabs?: any[],
  }>({
    startDate: dayjs().format('YYYY-MM-DD'),
    tabs: [{
      id: 1,
      name: '打开 DatePicker',
      onPress: () => {
        handleDate()
      },
    }, {
      id: 2,
      name: '设置起止范围',
      onPress: () => {
        handleDateMaxMin()
      },
    }, {
      id: 3,
      name: '禁用天',
      onPress: () => {
        handleDateDisDay()
      },
    }],
  })

  const handleDate = () => {
    DatePicker.show({
      value: dayjs(state.startDate).format('YYYY-MM-DD'),
      confirm: (val: any) => {
        console.log('val, index:', val)
        setState({ startDate: val })
      },
    })
  }

  const handleDateMaxMin = () => {
    DatePicker.show({
      value: dayjs(state.startDate).format('YYYY-MM-DD'),
      confirm: (val: string) => {
        console.log('val, index:', val)
        setState({ startDate: val })
      },
      options: {
        max: 2030,
        min: 2020,
      },
    })
  }

  const handleDateDisDay = () => {
    DatePicker.show({
      value: dayjs(state.startDate).format('YYYY-MM-DD'),
      confirm: (val: string) => {
        console.log('val, index:', val)
        setState({ startDate: val })
      },
      options: {
        max: 2030,
        min: 2020,
        showDay: false,
      },
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
        state.tabs?.map((item, index) => {
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
      <Text style={{
        marginLeft: 10,
      }}>startDate: {state.startDate}</Text>
    </View>
  )
}

export default DatePickerDemo
