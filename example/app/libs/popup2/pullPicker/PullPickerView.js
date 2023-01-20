import React, { useRef, useState, useCallback, useEffect } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useSingleState } from 'react-native-orzhtml-usecom'

import { initViewProps, initPullPickerProps, defaultProps, disappearCompleted, isEmpty } from '../libs/Common'
import { scaleSizeFool, setSpText } from '../libs/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

function PullPickerView (props) {
  const propsData = defaultProps(props, { ...initViewProps, ...initPullPickerProps })
  const { cancel, confirm, onDisappearCompleted, wheelHeight } = propsData
  const popRef = useRef(null)
  const [state, setState] = useSingleState({
    items: [],
    pickerValue: propsData.value,
    pickerIndex: 0,
  })

  useEffect(() => {
    if (propsData.items.length <= 0) {
      return
    }
    console.log('init')
    let index = 0
    let label = propsData.label
    let labelVal = propsData.labelVal
    let _items_ = []

    propsData.items.map((item, i) => {
      if (typeof item === 'string' || typeof item === 'number') {
        if (item === state.pickerValue) {
          index = i
        }
        _items_.push({
          label: item,
          value: item,
        })
      } else {
        if (item[labelVal] === state.pickerValue) {
          index = i
        }
        _items_.push({
          label: item[label],
          value: item[labelVal],
        })
      }
    })
    setState({
      items: _items_,
      pickerIndex: index,
    })
  }, [propsData.items])

  const hide = useCallback(() => {
    // console.log('PullPickerView hide')
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted])

  const onCancel = useCallback(() => {
    // console.log('PullPickerView onCancel')
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [cancel, onDisappearCompleted])

  const onConfirm = () => {
    // console.log('PullPickerView onConfirm')
    let _selectedValue = state.pickerValue
    let _selectedIndex = state.pickerIndex

    if (isEmpty(_selectedValue)) {
      _selectedValue = state.items[0].value
    }
    if (isEmpty(_selectedIndex)) {
      _selectedIndex = 0
    }

    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(() => confirm(_selectedValue, _selectedIndex), onDisappearCompleted)
    })
  }

  const onValueChange = (itemValue, itemIndex) => {
    setState({
      pickerValue: itemValue,
      pickerIndex: itemIndex,
    })
  }

  return (
    <PullView
      ref={popRef}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      onCloseRequest={hide}
      side="bottom"
      modal={propsData.modal}
      isBackPress={false}
    >
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: scaleSizeFool(5),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onCancel}
          style={{ padding: scaleSizeFool(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: setSpText(16), color: '#000' }}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirm}
          style={{ padding: scaleSizeFool(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: setSpText(16), color: '#1ACB79' }}>完成</Text>
        </TouchableOpacity>
      </View>
      <Picker
        style={{ backgroundColor: '#fff', height: wheelHeight }}
        selectedValue={state.pickerValue}
        items={state.items}
        onValueChange={onValueChange}
      />
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ backgroundColor: '#fff', height: insets.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

export default PullPickerView
