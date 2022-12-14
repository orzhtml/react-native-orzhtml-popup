import React, { FC, forwardRef, useEffect, useRef } from 'react'
import {
  Dimensions, View, Platform, FlatList, StyleSheet, Text,
  NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useSingleInstanceVar } from 'react-native-orzhtml-usecom'

import { setSpText, scaleSizeFool } from '../common/SetSize'

interface IProps {
    itemHeight: number;
    selectedValue?: string | number;
    items?: any;
    onValueChange?: (value: string | number, index: React.Key) => void;
    style?: StyleProp<ViewStyle>
}

interface PickerProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const CrossPicker: FC<PickerProps> = (props) => {
  const _listRef = useRef<FlatList>(null)
  const inst = useSingleInstanceVar<{
    init: boolean;
    itemH: number;
    timer: NodeJS.Timeout | string | number | undefined;
    canUpdate: boolean;
  }>({
    init: false,
    itemH: props.itemHeight,
    timer: undefined,
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

  const scrollToValue = (value: string | number | undefined) => {
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

  const scrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (inst.canUpdate) {
      let offset = event.nativeEvent.contentOffset.y
      updateValue(offset)
      inst.canUpdate = false
    }
  }

  const updateValue = (offset: number) => {
    let i = (offset + inst.itemH / 2) / inst.itemH
    // ?????? i ????????????????????????
    if (i > props.items.length) {
      i = props.items.length - 1
    }
    _listRef.current?.scrollToIndex({
      animated: true,
      index: i,
      viewPosition: 0.5,
    })
    // ?????? floor ?????? i ????????????
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
            return (<Picker.Item {...item} key={item.value} />)
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

const lineStyles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: setSpText(16),
  },
})

const Component = CrossPicker
// ????????????????????????Component?????????ref;????????????????????????refInstance????????????????????????
export default forwardRef((props: Partial<IProps>, ref) => {
  const initProps = {
    itemHeight: scaleSizeFool(50),
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
