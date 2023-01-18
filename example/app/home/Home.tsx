import React, { useState } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'

import AlertDemo from './components/AlertDemo'
import DatePickerDemo from './components/DatePickerDemo'
import LoadingDemo from './components/LoadingDemo'
import PopoverDemo from './components/PopoverDemo'
import PullDemo from './components/PullDemo'
import ToastDemo from './components/ToastDemo'

const Home = () => {
  const [tabs] = useState([{
    id: 1,
    name: '弹窗',
  }, {
    id: 2,
    name: '标注',
  }, {
    id: 3,
    name: 'Toast',
  }, {
    id: 4,
    name: '加载',
  }, {
    id: 5,
    name: 'Pull',
  }, {
    id: 6,
    name: 'DatePicker',
  }])
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight: 10,
      }}>
        {
          tabs.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id + index}
                style={{
                  borderWidth: 1,
                  borderColor: activeIndex === index ? 'red' : '#444',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginLeft: 10,
                  marginBottom: 10,
                }}
                onPress={() => {
                  setActiveIndex(index)
                }}
              >
                <Text style={{ color: activeIndex === index ? 'red' : '#444' }}>{item.name}</Text>
              </TouchableOpacity>
            )
          })
        }
        { activeIndex === 0 && (<AlertDemo />) }
        { activeIndex === 1 && (<PopoverDemo />)}
        { activeIndex === 2 && (<ToastDemo />)}
        { activeIndex === 3 && (<LoadingDemo />)}
        { activeIndex === 4 && (<PullDemo />)}
        { activeIndex === 5 && (<DatePickerDemo />)}
      </ScrollView>
    </View>
  )
}

export default Home
