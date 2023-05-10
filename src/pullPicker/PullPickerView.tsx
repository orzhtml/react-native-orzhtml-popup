import React, { useCallback, useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { disappearCompleted, initViewProps, isEmpty, PullPickerInit } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'
import type { IProps, IPullPickerOptions, PullVHandleRef } from '../common/Type'

interface Items {
  label: string,
  value: string | number,
}

interface CProps<T> extends IProps, IPullPickerOptions {
    cancel?: () => void,
    confirm?: (val: string | number, index: number) => void,
    onDisappearCompleted?: () => void,
    value: string | number,
    items: T[],
}

function PullPickerView<T> (props: CProps<T>) {
  const { cancel, confirm, onDisappearCompleted, wheelHeight } = props
  let PullVRef = useRef<PullVHandleRef>(null)
  const [state, setState] = useSingleState({
    items: [] as Items[],
    pickerValue: props.value,
    pickerIndex: 0,
  })

  useEffect(() => {
    if (props.items.length <= 0) {
      return
    }

    let index = 0
    let label = props.label
    let labelVal = props.labelVal
    let _items_: Items[] = []

    if (props.all) {
      // all 是否有 请选择 选项，可修改内容文案
      _items_.push({
        label: props.allText,
        value: props.allVal,
      } as unknown as Items)
    }

    props.items.map((item: T, i: number) => {
      if (typeof item === 'string' || typeof item === 'number') {
        if (item === state.pickerValue) {
          index = i
        }
        _items_.push({
          label: item,
          value: item,
        } as unknown as Items)
      } else {
        if (item[labelVal] === state.pickerValue) {
          index = i
        }
        _items_.push({
          label: item[label],
          value: item[labelVal],
        } as unknown as Items)
      }
    })

    setState({
      items: _items_,
      pickerIndex: index,
    })
  }, [props.items])

  const hide = useCallback(() => {
    PullVRef.current?.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted])

  const onCancel = useCallback(() => {
    PullVRef.current?.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [cancel, onDisappearCompleted])

  const onConfirm = () => {
    let _selectedValue = state.pickerValue
    let _selectedIndex = state.pickerIndex

    if (isEmpty(_selectedValue) || _selectedValue === '') {
      _selectedValue = state.items[0][props.labelVal]
    }
    if (isEmpty(_selectedIndex)) {
      _selectedIndex = 0
    }

    PullVRef.current?.close(() => {
      disappearCompleted(() => {
        confirm && confirm(_selectedValue, _selectedIndex)
      }, onDisappearCompleted)
    })
  }

  const onValueChange = (itemValue: string | number, itemIndex: number) => {
    setState({
      items: state.items,
      pickerValue: itemValue,
      pickerIndex: itemIndex,
    })
  }

  return (
    <PullView
      ref={PullVRef}
      containerStyle={{ backgroundColor: '#fff' }}
      onCloseRequest={hide}
      side="bottom"
      modal={props.modal}
      isBackPress={false}
    >
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: scaleSize(5),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onCancel}
          style={{ padding: scaleSize(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: scaleSize(16), color: '#000' }}>{props.cancelText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirm}
          style={{ padding: scaleSize(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: scaleSize(16), color: '#1ACB79' }}>{props.completeText}</Text>
        </TouchableOpacity>
      </View>
      <Picker
        style={{ backgroundColor: '#fff', height: wheelHeight }}
        itemStyle={props.itemStyle}
        selectedValue={state.pickerValue}
        items={state.items}
        onValueChange={onValueChange}
      />
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ height: insets?.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

function PullPicker<T> (props: Partial<CProps<T>>) {
  const initProps: CProps<T> = {
    ...initViewProps,
    ...PullPickerInit,
    ...props,
  }

  return (
    <PullPickerView {...initProps} />
  )
}

export default PullPicker
