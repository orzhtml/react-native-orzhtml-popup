import React, { FC, useEffect, useRef } from 'react'
import { Dimensions, View, Platform, FlatList, StyleSheet, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useSingleInstanceVar } from 'react-native-orzhtml-usecom'

import { setSpText, scaleSizeFool } from '../libs/SetSize'

interface CrossPlatformPickerProps {
    [p: string]: any;
}

const CrossPlatformPicker: FC<CrossPlatformPickerProps> = (props) => {
  const _listRef = useRef<FlatList>(null)
  const inst = useSingleInstanceVar<{
    init: boolean;
    itemH: number;
    timer: any;
    canUpdate: boolean;
  }>({
    init: false,
    itemH: props.itemHeight,
    timer: null,
    canUpdate: false,
  })

  useEffect(() => {
    if (Platform.OS !== 'ios' && props.selectedValue) {
      setTimeout(() => {
        inst.init = true
        scrollToValue(props.selectedValue)
      }, inst.init ? 0 : 300)
    }
  }, [props.selectedValue])

  const scrollToValue = (value: any) => {
    for (let index = 0; index < props.items.length; index++) {
      if (props.items[index].value === value) {
        _listRef.current?.scrollToIndex({
          animated: true,
          index: index,
          viewPosition: 0.5,
        })
        return
      }
    }
  }

  const scrollEnd = (event: any) => {
    let offset = event.nativeEvent.contentOffset.y
    inst.timer = setTimeout(() => {
      updateValue(offset)
    }, 100)
  }

  const onMomentumScrollBegin = () => {
    if (inst.timer) {
      clearTimeout(inst.timer)
      inst.timer = null
      inst.canUpdate = true
    }
  }

  const onMomentumScrollEnd = (event: any) => {
    if (inst.canUpdate) {
      let offset = event.nativeEvent.contentOffset.y
      updateValue(offset)
      inst.canUpdate = false
    }
  }

  const updateValue = (offset: number) => {
    let i = (offset + inst.itemH / 2) / inst.itemH
    // 修复 i 的下标不正确问题
    if (i > props.items.length) {
      i = props.items.length - 1
    }
    _listRef.current?.scrollToIndex({
      animated: true,
      index: i,
      viewPosition: 0.5,
    })
    // 通过 floor 获取 i 实际下标
    props.onValueChange && props.onValueChange(props.items[Math.floor(i)].value, i)
  }

  const renderiOS = () => {
    const { style, selectedValue, onValueChange, items } = props

    return (
      <Picker
        selectedValue={selectedValue}
        style={[{ height: inst.itemH * 5, width: Dimensions.get('window').width }, style]}
        itemStyle={lineStyles.text}
        onValueChange={onValueChange}
      >
        {
          items.map((item: any) => {
            return <Picker.Item {...item} key={item.value} />
          })
        }
      </Picker>
    )
  }

  if (Platform.OS === 'ios') {
    return renderiOS()
  }

  const { style, items, selectedValue } = props

  return (
    <View style={[{ height: inst.itemH * 5, width: Dimensions.get('window').width }, style]}>
      <FlatList style={{ flex: 1 }}
        ref={_listRef}
        contentContainerStyle={{ paddingVertical: inst.itemH * 2 }}
        getItemLayout={(data, index) => ({
          length: inst.itemH,
          offset: inst.itemH * index + inst.itemH * 2,
          index,
        })}
        keyExtractor={item => item.value + ''}
        showsVerticalScrollIndicator={false}
        // onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={scrollEnd}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        data={items}
        renderItem={({ item }) => {
          let isSelect = item.value === selectedValue
          return (
            <View style={{ height: inst.itemH, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Text style={[lineStyles.text, { opacity: isSelect ? 1 : 0.6 }]}>
                {item.label}
              </Text>
              {
                isSelect ? (
                  <>
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: '#ccc',
                      }}/>
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        right: 0,
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: '#ccc',
                      }}/>
                  </>
                ) : null
              }
            </View>
          )
        }} />
    </View>
  )
}

CrossPlatformPicker.defaultProps = {
  selectedValue: null,
  itemHeight: scaleSizeFool(50),
}

const lineStyles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: setSpText(16),
  },
})

export default CrossPlatformPicker
