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
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'

import { Popup } from './app/libs/popup'
import Home from './app/home/Home'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ flex: 1 }}>
        <Home />
      </View>
      <Popup />
    </SafeAreaView>
  )
}

export default App
