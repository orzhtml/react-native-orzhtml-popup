import React, { FC, forwardRef, useCallback, useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { disappearCompleted, initViewProps, IProps, isEmpty, popRefType } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

interface CProps extends IProps {
    cancel?: () => void,
    confirm?: (val: string | undefined, index: React.Key | undefined) => void,
    onDisappearCompleted?: () => void,
    label: string,
    labelVal: string,
    wheelHeight: number,
    value: string,
    items: any[],
    all?: boolean,
    allText: string,
    allVal: string,
}

interface PullPickerProps extends CProps {
    refInstance: React.ForwardedRef<any>,
}

const PullPickerView: FC<PullPickerProps> = props => {
  const { cancel, confirm, onDisappearCompleted, wheelHeight } = props
  let popRef = useRef<popRefType>(null)
  const [state, setState] = useSingleState<{
    items: any[],
    pickerValue?: string,
    pickerIndex?: React.Key | string,
  }>({
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
        label: props.allText,
        value: props.allVal,
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
      disappearCompleted(() => {
        confirm && confirm(_selectedValue, _selectedIndex)
      }, onDisappearCompleted)
    })
  }

  const onValueChange = (itemValue: any, itemIndex: any) => {
    setState({
      items: state.items,
      pickerValue: itemValue,
      pickerIndex: itemIndex,
    })
  }

  return (
    <PullView
      ref={popRef}
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
          <Text style={{ fontSize: scaleSize(16), color: '#000' }}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onConfirm}
          style={{ padding: scaleSize(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: scaleSize(16), color: '#1ACB79' }}>完成</Text>
        </TouchableOpacity>
      </View>
      <Picker
        style={{ backgroundColor: '#fff', height: wheelHeight }}
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

const Component = PullPickerView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    label: 'label',
    labelVal: 'value',
    wheelHeight: scaleSize(250),
    value: '',
    items: [],
    allText: '请选择',
    allVal: '',
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
