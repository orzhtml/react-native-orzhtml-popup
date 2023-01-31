import { Animated } from 'react-native'

const config = {
  duration: 200,
  useNativeDriver: false,
}

function fadeStart (opacity: Animated.Value | Animated.ValueXY, toValue: any) {
  let animates = [
    Animated.timing(opacity, {
      toValue: toValue,
      ...config,
    }),
  ]
  return animates
}

function fadeStop (opacity: Animated.Value | Animated.ValueXY) {
  let animates = [
    Animated.timing(opacity, {
      toValue: 0,
      ...config,
    }),
  ]
  return animates
}

function zoomStart (opacity: Animated.Value | Animated.ValueXY, translateX: Animated.Value | Animated.ValueXY, translateY: Animated.Value | Animated.ValueXY, scaleX: Animated.Value | Animated.ValueXY, scaleY: Animated.Value | Animated.ValueXY) {
  let animates = [
    Animated.timing(opacity, {
      toValue: 1,
      ...config,
    }),
    Animated.timing(translateX, {
      toValue: 0,
      ...config,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      ...config,
    }),
    Animated.timing(scaleX, {
      toValue: 1,
      ...config,
    }),
    Animated.timing(scaleY, {
      toValue: 1,
      ...config,
    }),
  ]
  return animates
}

function zoomStop (fromTransform: { translateX: any; translateY: any; scaleX: any; scaleY: any }, opacity: Animated.Value | Animated.ValueXY, translateX: Animated.Value | Animated.ValueXY, translateY: Animated.Value | Animated.ValueXY, scaleX: Animated.Value | Animated.ValueXY, scaleY: Animated.Value | Animated.ValueXY) {
  let animates = [
    Animated.timing(opacity, {
      toValue: 0,
      ...config,
    }),
    Animated.timing(translateX, {
      toValue: fromTransform.translateX,
      ...config,
    }),
    Animated.timing(translateY, {
      toValue: fromTransform.translateY,
      ...config,
    }),
    Animated.timing(scaleX, {
      toValue: fromTransform.scaleX,
      ...config,
    }),
    Animated.timing(scaleY, {
      toValue: fromTransform.scaleY,
      ...config,
    }),
  ]
  return animates
}

function marginStart (marginValue: Animated.Value | Animated.ValueXY) {
  let animates = [
    Animated.spring(marginValue, {
      toValue: 0,
      friction: 9,
      useNativeDriver: false,
    }),
  ]
  return animates
}

function marginStop (marginValue: Animated.Value | Animated.ValueXY, marginValueTo: any) {
  let animates = [
    Animated.spring(marginValue, {
      toValue: marginValueTo,
      friction: 9,
      useNativeDriver: false,
    }),
  ]
  return animates
}

export {
  fadeStart,
  fadeStop,
  zoomStart,
  zoomStop,
  marginStart,
  marginStop,
}
