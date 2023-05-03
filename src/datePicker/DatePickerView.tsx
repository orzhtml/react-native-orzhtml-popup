import React, { useRef, useCallback, useMemo, FC } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useSingleState } from 'react-native-orzhtml-usecom'
import dayjs from 'dayjs'

import { DatePickerInit, disappearCompleted, getMonths, initViewProps, IProps, IPullPickerOptions, isLeapYear, maxOrMinDate, popRefType } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

interface CProps extends IProps, IPullPickerOptions {
    onDisappearCompleted?: () => void,
    onCloseRequest?: () => void,
    cancel?: () => void,
    confirm?: (date: string) => void,
    value: string,
}

const DatePickerView: FC<CProps> = (props) => {
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
    const yearText = props.yearText || ''
    let _years = []
    for (let i = maxOrMinDate(props.min).year; i <= maxOrMinDate(props.max).year; ++i) {
      _years.push({
        label: i + yearText,
        value: i,
      })
    }
    return _years
  }, [props.max, props.min])

  const months = useMemo(() => {
    let year = state.date.get('year')
    const { min, max, monthText = '' } = props
    const { year: minYear, month: minMonth } = maxOrMinDate(min)
    const { year: maxYear, month: maxMonth } = maxOrMinDate(max)

    return getMonths(year, minYear, minMonth, maxYear, maxMonth, monthText)
  }, [props.max, props.min, props.monthText, state.date])

  let daysCount = useMemo(() => {
    let dayText = props.dayText || ''
    let d28 = { label: '28' + dayText, value: 28 }
    let d29 = { label: '29' + dayText, value: 29 }
    let d30 = { label: '30' + dayText, value: 30 }
    let d31 = { label: '31' + dayText, value: 31 }
    let _daysCount = [
      [d31, d28, d31, d30, d31, d30, d31, d31, d30, d31, d30, d31],
      [d31, d29, d31, d30, d31, d30, d31, d31, d30, d31, d30, d31],
    ]
    return _daysCount
  }, [props.dayText])

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
    const maxDate = maxOrMinDate(props.max)
    const minDate = maxOrMinDate(props.min)

    const maxYear = maxDate.year
    const maxMonth = maxDate.month - 1
    const maxDay = maxDate.day

    const minYear = minDate.year
    const minMonth = minDate.month - 1
    const minDay = minDate.day

    let newMonth = month
    let newDay = day

    if (year === maxYear) {
      newMonth = Math.min(maxMonth, month)
      newDay = Math.min(maxDay, day)
    } else if (year === minYear) {
      newMonth = Math.max(minMonth, month)
      newDay = Math.max(minDay, day)
    }

    let _daysCount_ = daysCount[isLeapYear(year) ? 1 : 0][newMonth]

    if (newDay > _daysCount_.value) {
      newDay = _daysCount_.value
    }

    _date = _date.set('year', year).set('month', newMonth).set('date', newDay)

    setState({ date: _date })
  }, [state.date, daysCount, props.max, props.min])

  const renderContent = () => {
    let year = state.date.get('year')
    let month = state.date.get('months')
    let day = state.date.get('date')

    let _daysCount_ = daysCount[isLeapYear(year) ? 1 : 0][month]
    let days = []

    const maxArr = maxOrMinDate(props.max)
    const minArr = maxOrMinDate(props.min)
    let maxDay = _daysCount_.value
    let minDay = 1

    if (year === maxArr.year) {
      maxDay = maxArr.day
    } else if (year === minArr.year) {
      minDay = minArr.day
    }

    for (let i = minDay; i <= maxDay; ++i) {
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
          <Text style={{ fontSize: scaleSize(16), color: '#000' }}>{props.leftBtnText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onConfirm()}
          style={{ padding: scaleSize(16), justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: scaleSize(16), color: '#1ACB79' }}>{props.rightBtnText}</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ height: insets?.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

function DatePicker (props: Partial<CProps>) {
  const initProps: CProps = {
    ...initViewProps,
    ...DatePickerInit,
    ...props,
  }

  return (
    <DatePickerView {...initProps} />
  )
}

export default DatePicker
