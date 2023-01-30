import React, { useRef, useState, useCallback, useMemo } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import dayjs from 'dayjs'

import { initViewProps, initDatePickerProps, defaultProps, disappearCompleted, isLeapYear } from '../libs/Common'
import { scaleSize } from '../libs/SetSize'
import PullView from '../PullView'
import Picker from '../picker'

function DatePickerView (props) {
  const propsData = defaultProps(props, { ...initViewProps, ...initDatePickerProps })
  const { cancel, confirm, onDisappearCompleted } = propsData
  let popRef = useRef(null)
  let [date, updateDate] = useState(() => {
    console.log('propsData.value:', propsData.value)
    let _date = new Date(propsData.value)
    console.log('_date_date:', _date)
    if (Number.isNaN(_date.getTime())) {
      _date = new Date()
    }
    return _date
  })

  let years = useMemo(() => {
    let _years = []
    for (let i = propsData.min; i <= propsData.max; ++i) {
      _years.push({
        label: i + '年',
        value: i,
      })
    }
    // console.log('_years init:', _years)
    return _years
  }, [propsData.max, propsData.min])
  let months = useMemo(() => {
    let _months = []
    for (let i = 1; i <= 12; ++i) {
      _months.push({
        label: i + '月',
        value: i,
      })
    }
    // console.log('_months init:', _months)
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
    // console.log('_daysCount init:', _daysCount)
    return _daysCount
  }, [])

  const hide = useCallback(() => {
    // console.log('DatePickerView hide')
    if (propsData.modal) {
      return null
    }
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted, propsData.modal])

  const onCancel = useCallback(() => {
    // console.log('DatePickerView onCancel')
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [cancel, onDisappearCompleted])

  const onConfirm = useCallback(() => {
    // console.log('DatePickerView onConfirm')
    let value = dayjs(new Date(date)).format('YYYY-MM-DD')

    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(() => confirm(value), onDisappearCompleted)
    })
  }, [date, confirm, onDisappearCompleted])

  const onDateChange = useCallback((year, month, day) => {
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
          propsData.showYear ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              itemStyle={{ textAlign: 'center' }}
              items={years}
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) => onDateChange(itemValue, month, day)}
            />
          ) : null
        }
        {
          propsData.showMonth ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              itemStyle={{ textAlign: 'center' }}
              items={months}
              selectedValue={month + 1}
              onValueChange={(itemValue, itemIndex) => onDateChange(year, itemValue - 1, day)}
            />
          ) : null
        }
        {
          propsData.showDay ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              itemStyle={{ textAlign: 'center' }}
              items={days}
              selectedValue={day}
              onValueChange={(itemValue, itemIndex) => onDateChange(year, month, itemValue)}
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
      modal={propsData.modal}
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
      {renderContent()}
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ backgroundColor: '#fff', height: insets.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

export default DatePickerView
