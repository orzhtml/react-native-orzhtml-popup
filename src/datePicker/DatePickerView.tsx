import React, { useRef, useCallback, useMemo, forwardRef, FC } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useSingleState } from 'react-native-orzhtml-usecom'
import dayjs from 'dayjs'

import { disappearCompleted, initViewProps, IProps, isLeapYear, popRefType } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

interface CProps extends IProps {
    onDisappearCompleted?: () => void,
    onCloseRequest?: () => void,
    cancel?: () => void,
    confirm?: (date: string) => void,
    value?: string,
    max: number,
    min: number,
    showYear: boolean,
    showMonth: boolean,
    showDay: boolean,
    leftBtnText?: string,
    rightBtnText?: string,
    yearText?: string,
    monthText?: string,
    dayText?: string,
}

interface DatePickerProps extends CProps {
    refInstance: React.ForwardedRef<any>;
}

const DatePickerView: FC<DatePickerProps> = (props) => {
  const { cancel, confirm, onDisappearCompleted } = props
  let popRef = useRef<popRefType>(null)
  let [state, setState] = useSingleState(() => {
    let _date = dayjs(props.value || '')
    if (Number.isNaN(_date.valueOf())) {
      _date = dayjs()
    }
    return {
      date: _date,
    }
  })

  let years = useMemo(() => {
    let _years = []
    for (let i = props.min; i <= props.max; ++i) {
      _years.push({
        label: i + (props?.yearText || ''),
        value: i,
      })
    }
    return _years
  }, [props.max, props.min])

  let months = useMemo(() => {
    let _months = []
    for (let i = 1; i <= 12; ++i) {
      _months.push({
        label: i + (props.monthText || ''),
        value: i,
      })
    }
    return _months
  }, [])

  let daysCount = useMemo(() => {
    let d28 = { label: '28' + (props.dayText || ''), value: 28 }
    let d29 = { label: '29' + (props.dayText || ''), value: 29 }
    let d30 = { label: '30' + (props.dayText || ''), value: 30 }
    let d31 = { label: '31' + (props.dayText || ''), value: 31 }
    let _daysCount = [
      [d31, d28, d31, d30, d31, d30, d31, d31, d30, d31, d30, d31],
      [d31, d29, d31, d30, d31, d30, d31, d31, d30, d31, d30, d31],
    ]
    return _daysCount
  }, [])

  const hide = useCallback(() => {
    if (props.modal) {
      return null
    }
    popRef.current?.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted, props.modal])

  const onCancel = useCallback(() => {
    popRef.current?.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [cancel, onDisappearCompleted])

  const onConfirm = useCallback(() => {
    let value = state.date.format('YYYY/MM/DD')
    popRef.current?.close(() => {
      disappearCompleted(() => {
        confirm && confirm(value)
      }, onDisappearCompleted)
    })
  }, [state.date, confirm, onDisappearCompleted])

  const onDateChange = useCallback((year: number, month: number, day: number) => {
    let _date = state.date.set('year', year)
    let _daysCount_ = daysCount[isLeapYear(year) ? 1 : 0][month]

    if (day > _daysCount_.value) {
      day = _daysCount_.value
    }
    _date = _date.set('year', year).set('month', month).set('date', day)
    setState({ date: _date })
  }, [state.date, daysCount])

  const renderContent = () => {
    let year = state.date.get('year')
    let month = state.date.get('months')
    let day = state.date.get('date')

    let _daysCount_ = daysCount[isLeapYear(year) ? 1 : 0][month]
    let days = []
    for (let i = 1; i <= _daysCount_.value; ++i) {
      days.push({ label: `${i}${props.dayText}`, value: i })
    }
    return (
      <View style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
        {
          props.showYear ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              items={years}
              selectedValue={year}
              onValueChange={itemValue => onDateChange(Number(itemValue), month, day)}
            />
          ) : null
        }
        {
          props.showMonth ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              items={months}
              selectedValue={month + 1}
              onValueChange={itemValue => onDateChange(year, Number(itemValue) - 1, day)}
            />
          ) : null
        }
        {
          props.showMonth && props.showDay ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              items={days}
              selectedValue={day}
              onValueChange={itemValue => onDateChange(year, month, Number(itemValue))}
            />
          ) : null
        }
      </View>
    )
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
          onPress={() => {
            onConfirm()
          }}
          style={{ padding: scaleSize(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: scaleSize(16), color: '#1ACB79' }}>完成</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ height: insets?.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

const Component = DatePickerView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    max: 2080,
    min: 1900,
    showYear: true,
    showMonth: true,
    showDay: true,
    leftBtnText: '取消',
    rightBtnText: '确定',
    yearText: '年',
    monthText: '月',
    dayText: '日',
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
