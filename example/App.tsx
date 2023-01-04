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
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'

import { Popup, Overlay } from './app/libs/popup'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ flex: 1, paddingTop: 100 }}>
        <Text>lzkjlk</Text>
        <Button
          title="点击"
          onPress={() => {
            Overlay.show(<Overlay.View />)
          }}
        />
      </View>
      <Popup />
    </SafeAreaView>
  )
}

export default App
