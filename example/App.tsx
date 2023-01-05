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

import { Popup, Overlay, Toast, Popover, Loading, Alert } from './app/libs/popup'

const App = () => {
  // 显示标注
  const _showPullView = () => {
    let overlayView = (
      <Overlay.PullView
        containerStyle={{
          height: 400,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        side="bottom"
      >
        <View style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flex: 1,
          padding: 15,
        }}>
          <Text>!23</Text>
        </View>
      </Overlay.PullView>
    )
    Overlay.show(overlayView)
  }

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
                _showPullView()
                // Toast.message('小明')
                // Toast.show({
                //   text: '小李',
                // })
                // Loading.show()
                // setTimeout(() => {
                //   Loading.loadingRef.updateTitle('加载中...')
                // }, 1000)
                // setTimeout(() => {
                //   Loading.hide()
                // }, 3000)
                // Alert('提示', '提示内容内容', [{
                //   text: '取消',
                //   style: 'cancel',
                //   onPress: () => {
                //     console.log('取消')
                //   },
                // }, {
                //   text: '确定',
                //   style: 'warning',
                //   onPress: () => {
                //     console.log('确定')
                //   },
                // }])
                // Alert('提示', [{
                //   text: '取消',
                //   style: 'cancel',
                //   onPress: () => {
                //     console.log('取消')
                //   },
                // }, {
                //   text: '确定',
                //   style: 'warning',
                //   onPress: () => {
                //     console.log('确定')
                //   },
                // }], {
                //   modal: false,
                // })
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
