import React, { useRef, useState, useCallback, useMemo, forwardRef, FC } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import dayjs from 'dayjs'

import { disappearCompleted, isLeapYear, OverlayPointerEvents } from '../common/Common'
import { scaleSizeFool, setSpText } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

interface IProps {
  modal: boolean,
  animated: boolean,
  overlayPointerEvents: OverlayPointerEvents,
  isBackPress: boolean,
  overlayOpacity: number,
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
}

interface DatePickerProps extends IProps {
  refInstance: React.ForwardedRef<any>;
}

const DatePickerView: FC<DatePickerProps> = (props) => {
  const { cancel, confirm, onDisappearCompleted } = props
  let popRef = useRef<{ close:(animated?: boolean | (() => void), onCloseCallback?: () => void) => void }>(null)

  let [date, updateDate] = useState(() => {
    let _date = new Date(props.value || '')
    if (Number.isNaN(_date.getTime())) {
      _date = new Date()
    }
    return _date
  })

  let years = useMemo(() => {
    let _years = []
    for (let i = props.min; i <= props.max; ++i) {
      _years.push({
        label: i + '年',
        value: i,
      })
    }
    return _years
  }, [props.max, props.min])

  let months = useMemo(() => {
    let _months = []
    for (let i = 1; i <= 12; ++i) {
      _months.push({
        label: i + '月',
        value: i,
      })
    }
    return _months
  }, [])

  let daysCount = useMemo(() => {
    let d28 = { label: '28日', value: 28 }
    let d29 = { label: '29日', value: 29 }
    let d30 = { label: '30日', value: 30 }
    let d31 = { label: '31日', value: 31 }
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
    let value = dayjs(new Date(date)).format('YYYY-MM-DD')

    popRef.current?.close(() => {
      disappearCompleted(() => {
        confirm && confirm(value)
      }, onDisappearCompleted)
    })
  }, [date, confirm, onDisappearCompleted])

  const onDateChange = useCallback((year: number, month: number, day: number) => {
    date.setFullYear(year)
    let _daysCount_ = daysCount[isLeapYear(year) ? 1 : 0][month]
    if (day > _daysCount_.value) {
      day = _daysCount_.value
      date.setDate(day)
      date.setMonth(month)
    } else {
      date.setMonth(month)
      date.setDate(day)
    }
    updateDate(new Date(date))
  }, [date, daysCount])

  const renderContent = () => {
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let _daysCount_ = daysCount[isLeapYear(year) ? 1 : 0][month]
    let days = []
    for (let i = 1; i <= _daysCount_.value; ++i) {
      days.push({ label: `${i}日`, value: i })
    }
    return (
      <View style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
        {
          props.showYear ? (
            <Picker
              style={{ height: scaleSizeFool(250), flex: 1 }}
              //   itemStyle={{ textAlign: 'center' }}
              items={years}
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) => onDateChange(Number(itemValue), month, day)}
            />
          ) : null
        }
        {
          props.showMonth ? (
            <Picker
              style={{ height: scaleSizeFool(250), flex: 1 }}
              //   itemStyle={{ textAlign: 'center' }}
              items={months}
              selectedValue={month + 1}
              onValueChange={(itemValue, itemIndex) => onDateChange(year, Number(itemValue) - 1, day)}
            />
          ) : null
        }
        {
          props.showMonth && props.showDay ? (
            <Picker
              style={{ height: scaleSizeFool(250), flex: 1 }}
              //   itemStyle={{ textAlign: 'center' }}
              items={days}
              selectedValue={day}
              onValueChange={(itemValue, itemIndex) => onDateChange(year, month, Number(itemValue))}
            />
          ) : null
        }
      </View>
    )
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
      {renderContent()}
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ backgroundColor: '#fff', height: insets?.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

const Component = DatePickerView
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
    max: 2080,
    min: 1900,
    showYear: true,
    showMonth: true,
    showDay: true,
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
