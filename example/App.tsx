/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import {
  StatusBar,
  View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { Popup } from './app/libs/popup'
import Home from './app/home/Home'

const App = () => {
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
