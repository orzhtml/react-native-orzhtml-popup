import React, { FC, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { Animated, BackHandler, PanResponder, Platform, StatusBar, StyleProp, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native'

import { fadeStart, fadeStop } from './common/Animated'
import { disappearCompleted, initViewProps, IProps, PVHandleRef } from './common/Common'
import dynamicStyles from './style'

interface CProps extends IProps {
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    barStyles?: StyleProp<ViewStyle>,
    onDisappearCompleted?: () => void,
    onCloseRequest?: () => void,
    onAppearCompleted?: () => void,
    zIndex?: number,
}

interface PViewProps extends CProps {
    refInstance: React.ForwardedRef<PVHandleRef>,
}

const PView: FC<PViewProps> = props => {
  const currentMode = useColorScheme()
  const styles = props.useDark && currentMode ? dynamicStyles[currentMode] : dynamicStyles.light
  const touchStateID = useRef<null | number>(null)
  const closed = useRef(false)
  const opacityAnim = useRef(new Animated.Value(0))

  const hide = useCallback((animated = props.animated, onCloseCallback?: () => void) => {
    if (closed.current) return true
    closed.current = true
    disappear({
      animated,
      opacityAnim: opacityAnim.current,
      onCloseCallback,
      onDisappearCompleted: props.onDisappearCompleted,
    })
    return true
  }, [props.onDisappearCompleted, props.animated])
  // 安卓返回键关闭弹窗
  const closeRequest = useCallback(() => {
    if (props.onCloseRequest) {
      props.onCloseRequest()
    } else if (!props.modal) {
      hide()
    }
  }, [hide, props])

  useImperativeHandle(props.refInstance, () => ({
    close: (animated = props.animated, onCloseCallback?: () => void) => {
      if (typeof animated === 'function') {
        onCloseCallback = animated
        animated = props.animated
      }
      hide(animated, onCloseCallback)
    },
  }))
  // 处理安卓返回按钮的功能
  useEffect(() => {
    if (Platform.OS !== 'android') { return () => { } }
    const onBackPress = () => {
      if (props.isBackPress) {
        // 安卓返回键关闭弹窗
        closeRequest()
        return true
      } else {
        return false
      }
    }
    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
  }, [props.isBackPress, closeRequest])

  useEffect(() => {
    appear({
      animated: !!props.animated,
      opacityAnim: opacityAnim.current,
      opacityAnimTo: props.overlayOpacity,
      onAppearCompleted: props.onAppearCompleted,
    })
  }, [props.animated, props.overlayOpacity, props.onAppearCompleted])

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => true,
    onPanResponderGrant: (e, gestureState) => touchStateID.current = gestureState.stateID,
    onPanResponderRelease: (e, gestureState) => touchStateID.current === gestureState.stateID ? closeRequest() : null,
  })

  return (
    <View
      style={[
        lineStyles.screen,
        props.zIndex ? {
          zIndex: props.zIndex,
        } : null,
      ]}
      pointerEvents={props.overlayPointerEvents}
    >
      <Animated.View
        style={[
          lineStyles.screen,
          {
            backgroundColor: styles.markPullView,
            opacity: opacityAnim.current,
          },
          StyleSheet.flatten(props.barStyles),
        ]}
        {...panResponder.panHandlers}
      >
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' />
      </Animated.View>
      <View
        style={[
          {
            backgroundColor: 'rgba(0,0,0,0)',
            flex: 1,
          },
          StyleSheet.flatten(props.style),
        ]}
        pointerEvents='box-none'
      >
        {props.children}
      </View>
    </View>
  )
}

function appear ({ animated, opacityAnim, opacityAnimTo, onAppearCompleted }: {
    animated: boolean;
    opacityAnim: Animated.Value;
    opacityAnimTo: number;
    onAppearCompleted?: () => void;
  }) {
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

function disappear ({ animated, opacityAnim, onCloseCallback, onDisappearCompleted }: {
    animated: boolean;
    opacityAnim: Animated.Value;
    onCloseCallback?: () => void,
    onDisappearCompleted?: () => void
  }) {
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

const Component = PView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef<PVHandleRef, Partial<CProps>>((props: Partial<CProps>, ref) => {
  const initProps = {
    ...initViewProps,
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
