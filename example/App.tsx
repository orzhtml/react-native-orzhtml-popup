/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react'
import {
  StatusBar,
  View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { Popup, setPopupDefaultLabels } from './app/libs/popup'
import Home from './app/home/Home'

const App = () => {
  useEffect(() => {
    setPopupDefaultLabels({
      alert: {
        okText: 'ok',
        cancelText: 'cancel',
      },
      actionSheet: {
        cancelText: 'cancel',
      },
      datePicker: {
        leftBtnText: 'cancel',
        rightBtnText: 'complete',
        yearText: 'year',
        monthText: 'month',
        dayText: 'day',
      },
      pullPicker: {
        allText: 'Please select',
        cancelText: 'cancel',
        completeText: 'complete',
      },
    })
  }, [])
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <Home />
      </SafeAreaView>
      <Popup />
    </SafeAreaProvider>
  )
}

export default App
