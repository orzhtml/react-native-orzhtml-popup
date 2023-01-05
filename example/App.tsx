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

import { Popup, Overlay, Toast, Popover } from './app/libs/popup'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ flex: 1, paddingTop: 100 }}>
        <Text>lzkjlk</Text>
        <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: 200,
          }}>
            <Popover
              contentStyle={[{
                // backgroundColor: 'rgba(0, 0, 0, 0.8)',
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 12,
                paddingRight: 12,
              }]}
              arrow='bottom'
              paddingCorner={16}
            >
              <Text style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#FFAC00',
              }}>保存在app端 实时查看</Text>
            </Popover>
            <Button
              title="点击"
              onPress={() => {
                // Toast.message('小明')
                Toast.show({
                  text: '小李',
                })
              }}
            />
          </View>
        </View>
      </View>
      <Popup />
    </SafeAreaView>
  )
}

export default App
