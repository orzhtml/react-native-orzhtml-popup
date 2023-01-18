import React, { useRef, useCallback, useEffect, forwardRef } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useSingleState } from 'react-native-orzhtml-usecom'

import { disappearCompleted, isEmpty } from '../common/Common'
import { scaleSizeFool, setSpText } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

interface IProps {
  [p: string]: any;
}

function PullPickerView (props: any) {
  const { cancel, confirm, onDisappearCompleted, wheelHeight } = props
  let popRef = useRef<{ close:(animated?: boolean | (() => void), onCloseCallback?: () => void) => void }>(null)
  const [state, setState] = useSingleState<any>({
    items: [],
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
    let _items_ = []

    if (props.all) {
      // all 是否有 请选择 选项，可修改内容文案
      _items_.push({
        label: props.allText || '请选择',
        value: props.allVal || '',
      })
    }

    props.items.map((item: { [x: string]: any }, i: number) => {
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
  }, [props.items])

  const hide = useCallback(() => {
    popRef.current?.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted])

  const onCancel = useCallback(() => {
    popRef.current?.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [cancel, onDisappearCompleted])

  const onConfirm = () => {
    let _selectedValue = state.pickerValue
    let _selectedIndex = state.pickerIndex

    if (isEmpty(_selectedValue) || _selectedValue === '') {
      _selectedValue = state.items[0].value
    }
    if (isEmpty(_selectedIndex) || _selectedIndex === '') {
      _selectedIndex = 0
    }

    popRef.current?.close(() => {
      disappearCompleted(() => confirm(_selectedValue, _selectedIndex), onDisappearCompleted)
    })
  }

  const onValueChange = (itemValue: any, itemIndex: any) => {
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
      modal={props.modal}
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
        {(insets) => (<View style={{ backgroundColor: '#fff', height: insets?.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

const Component = PullPickerView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef(({
  overlayPointerEvents = 'auto',
  ...other
}: Partial<IProps>, ref) => {
  const initProps = {
    modal: false,
    animated: true,
    overlayPointerEvents,
    isBackPress: true,
    overlayOpacity: 0.55,
    useDark: false,
    label: 'label',
    labelVal: 'value',
    wheelHeight: scaleSizeFool(250),
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
