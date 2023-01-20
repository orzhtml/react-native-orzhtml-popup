import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import ReactNative, { StyleSheet, Animated, View, PanResponder, Platform, StatusBar } from 'react-native'
import { useDynamicValue } from 'react-native-dynamic'

import { initViewProps, defaultProps, disappearCompleted } from './libs/Common'
import { fadeStart, fadeStop } from './libs/Animated'
import dynamicStyles from './style'

const PView = forwardRef((props, ref) => {
  const styles = useDynamicValue(dynamicStyles)
  const propsData = defaultProps(props, initViewProps)
  let touchStateID = useRef(null)
  let closed = useRef(false)
  const opacityAnim = useRef(new Animated.Value(0))

  const hide = useCallback((animated = props.animated, onCloseCallback) => {
    if (closed.current) return true
    closed.current = true
    disappear({
      animated,
      opacityAnim: opacityAnim.current,
      onCloseCallback,
      onDisappearCompleted: propsData.onDisappearCompleted,
    })
    return true
  }, [propsData.onDisappearCompleted, props.animated])

  // 安卓返回键关闭弹窗
  const closeRequest = useCallback(() => {
    if (propsData.onCloseRequest) {
      propsData.onCloseRequest()
    } else if (!propsData.modal) {
      hide()
    }
  }, [hide, propsData])

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => true,
    onPanResponderGrant: (e, gestureState) => touchStateID.current = gestureState.stateID,
    onPanResponderRelease: (e, gestureState) => touchStateID.current === gestureState.stateID ? closeRequest() : null,
  })

  useImperativeHandle(ref, () => ({
    close: (animated = propsData.animated, onCloseCallback = null) => {
      if (typeof animated === 'function') {
        onCloseCallback = animated
        animated = propsData.animated
      }
      hide(animated, onCloseCallback)
    },
  }))

  // 处理安卓返回按钮的功能
  useEffect(() => {
    if (Platform.OS !== 'android') { return () => {} }
    const BackHandler = ReactNative.BackHandler ? ReactNative.BackHandler : ReactNative.BackAndroid
    const onBackPress = () => {
      if (propsData.isBackPress) {
        // 安卓返回键关闭弹窗
        closeRequest()
        return true
      } else {
        return false
      }
    }
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
  }, [propsData.isBackPress, closeRequest])

  useEffect(() => {
    appear({
      animated: propsData.animated,
      opacityAnim: opacityAnim.current,
      opacityAnimTo: propsData.overlayOpacity,
      onAppearCompleted: propsData.onAppearCompleted,
    })
  }, [propsData.animated, propsData.overlayOpacity, propsData.onAppearCompleted])

  return (
    <View
      style={lineStyles.screen}
      pointerEvents={propsData.overlayPointerEvents}
    >
      <Animated.View
        style={[
          lineStyles.screen,
          {
            backgroundColor: styles.markPullView, opacity: opacityAnim.current,
          },
          props.barStyles,
        ]}
        {...panResponder.panHandlers}
      >
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' />
      </Animated.View>
      <View
        style={[
          { backgroundColor: 'rgba(0,0,0,0)', flex: 1 },
          propsData.style,
        ]}
        pointerEvents='box-none'
      >
        {propsData.children}
      </View>
    </View>
  )
})

function appear ({ animated, opacityAnim, opacityAnimTo, onAppearCompleted }) {
  if (animated) {
    opacityAnim.setValue(0)
    Animated.parallel(fadeStart(opacityAnim, opacityAnimTo)).start(e => {
      onAppearCompleted && onAppearCompleted()
    })
  } else {
    opacityAnim.setValue(opacityAnimTo)
    onAppearCompleted && onAppearCompleted()
  }
}

function disappear ({ animated, opacityAnim, onCloseCallback, onDisappearCompleted }) {
  if (animated) {
    Animated.parallel(fadeStop(opacityAnim)).start(e => disappearCompleted(onCloseCallback, onDisappearCompleted))
  } else {
    disappearCompleted(onCloseCallback, onDisappearCompleted)
  }
}

const lineStyles = StyleSheet.create({
  screen: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default PView
