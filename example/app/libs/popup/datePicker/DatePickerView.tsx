import React, { useRef, useCallback, useMemo, FC, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import dayjs from 'dayjs'

import { DatePickerInit, disappearCompleted, getMonths, initViewProps, isLeapYear, maxOrMinDate, daysInMonth } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'
import Picker from '../picker'
import type { IDatePickerOptions, IProps, PullVHandleRef } from '../common/Type'

interface CProps extends IProps, IDatePickerOptions {
    onDisappearCompleted?: () => void,
    onCloseRequest?: () => void,
    cancel?: () => void,
    confirm?: (date: string) => void,
    value: string,
}

const DatePickerView: FC<CProps> = (props) => {
  const { cancel, confirm, onDisappearCompleted } = props
  let PullVRef = useRef<PullVHandleRef>(null)
  const maxDate = useMemo(() => {
    return maxOrMinDate(props.max)
  }, [props.max])
  const minDate = useMemo(() => {
    return maxOrMinDate(props.min)
  }, [props.min])
  const [dateValue, setDateValue] = useState(() => {
    const value = props.value ? dayjs(props.value) : dayjs()

    const maxYear = maxDate.year
    const maxMonth = maxDate.month - 1
    const maxDay = maxDate.day

    const minYear = minDate.year
    const minMonth = minDate.month - 1
    const minDay = minDate.day

    let year = value.year()
    const month = value.month()
    const day = value.date()
    if (year > maxYear) {
      year = maxYear
    } else if (year < minYear) {
      year = minYear
    }
    let newMonth = month
    let newDay = day
    if (year === maxYear) {
      newMonth = Math.min(maxMonth, month)
      newDay = Math.min(maxDay, day)
    } else if (year === minYear) {
      newMonth = Math.max(minMonth, month)
      newDay = Math.max(minDay, day)
    }

    return dayjs().year(year).month(newMonth).date(newDay)
  })

  const years = useMemo(() => {
    const yearText = props.yearText || ''
    const minYear = minDate.year
    const maxYear = maxDate.year

    const _years = []
    for (let i = minYear; i <= maxYear; i++) {
      _years.push({ label: `${i}${yearText}`, value: i })
    }
    return _years
  }, [maxDate.year, minDate.year, props.yearText])

  const months = useMemo(() => {
    const { monthText = '' } = props
    const year = dateValue.year()
    const { year: minYear, month: minMonth } = minDate
    const { year: maxYear, month: maxMonth } = maxDate

    return getMonths(year, minYear, minMonth, maxYear, maxMonth, monthText)
  }, [minDate, maxDate, props.monthText, dateValue])

  const days = useMemo(() => {
    const year = dateValue.year()
    const month = dateValue.month()
    const { dayText = '' } = props
    const _days = []
    let daysCount = [
      [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    ]
    let maxDay = daysCount[isLeapYear(year) ? 1 : 0][month]
    let minDay = 1

    if (year === maxDate.year && month === maxDate.month - 1) {
      maxDay = maxDate.day
    }
    if (year === minDate.year && month === minDate.month - 1) {
      minDay = minDate.day
    }

    for (let i = minDay; i <= maxDay; i++) {
      _days.push({ label: `${i}${dayText}`, value: i })
    }

    return _days
  }, [dateValue, maxDate, minDate, props.dayText])

  const hide = useCallback(() => {
    if (props.modal) {
      return null
    }
    PullVRef.current?.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted, props.modal])

  const onCancel = useCallback(() => {
    PullVRef.current?.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [cancel, onDisappearCompleted])

  const onConfirm = useCallback(() => {
    let value = dateValue.format('YYYY/MM/DD')
    PullVRef.current?.close(() => {
      disappearCompleted(() => {
        confirm && confirm(value)
      }, onDisappearCompleted)
    })
  }, [dateValue, confirm, onDisappearCompleted])

  const onDateChange = useCallback((year: number, month: number, day: number) => {
    let newDate = dateValue
    let newMonth = month
    let newDay = day

    if (year === maxDate.year) {
      if (newMonth > maxDate.month - 1) {
        newMonth = maxDate.month - 1
        if (day > maxDate.day) {
          newDay = maxDate.day
        } else if (day > daysInMonth(maxDate.month, year)) {
          newDay = daysInMonth(maxDate.month, year)
        }
      } else if (newMonth === maxDate.month - 1) {
        if (day > maxDate.day) {
          newDay = maxDate.day
        }
      } else {
        const maxDays = daysInMonth(newMonth + 1, year)
        if (newDay > maxDays) {
          newDay = maxDays
        }
      }
      // console.log('newMonth1 newDay:', newMonth, newDay)
    } else if (year === minDate.year) {
      if (newMonth < minDate.month - 1) {
        newMonth = minDate.month - 1
        if (day < minDate.day) {
          newDay = minDate.day
        } else if (day > daysInMonth(minDate.month, year)) {
          newDay = daysInMonth(minDate.month, year)
        }
      } else if (newMonth === minDate.month - 1) {
        if (day < minDate.day) {
          newDay = minDate.day
        }
      } else {
        const minDays = daysInMonth(newMonth + 1, year)
        if (newDay > minDays) {
          newDay = minDays
        }
      }
      // console.log('newMonth2 newDay:', newMonth, newDay)
    } else {
      // check if the day exceeds the maximum number of days in the new month
      const maxDays = daysInMonth(newMonth + 1, year)
      if (newDay > maxDays) {
        newDay = maxDays
      }
      // console.log('newMonth3 newDay:', newMonth, newDay)
    }

    newDate = newDate.set('year', year).set('month', newMonth).set('date', newDay)
    // console.log('newDate:', newDate.format('YYYY/MM/DD'))

    setDateValue(newDate)
  }, [dateValue])

  const onValueChange = useCallback(
    (values: number[]) => {
      const [year, month, day] = values
      // console.log('year, month, day:', year, month, day)

      onDateChange(year, month, day)
    },
    [onDateChange],
  )

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
        {
          props.showYear ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              items={years}
              selectedValue={dateValue.year()}
              onValueChange={itemValue => onValueChange([Number(itemValue), dateValue.month(), dateValue.date()])}
            />
          ) : null
        }
        {
          props.showMonth ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              items={months}
              selectedValue={dateValue.month() + 1}
              onValueChange={itemValue => onValueChange([dateValue.year(), Number(itemValue) - 1, dateValue.date()])}
            />
          ) : null
        }
        {
          props.showMonth && props.showDay ? (
            <Picker
              style={{ height: scaleSize(250), flex: 1 }}
              items={days}
              selectedValue={dateValue.date()}
              onValueChange={itemValue => onValueChange([dateValue.year(), dateValue.month(), Number(itemValue)])}
            />
          ) : null
        }
      </View>
    )
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
