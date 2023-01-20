import { Animated } from 'react-native'

const config = {
  duration: 200,
  useNativeDriver: false,
}

function fadeStart (opacity, toValue) {
  let animates = [
    Animated.timing(opacity, {
      toValue: toValue,
      ...config,
    }),
  ]
  return animates
}

function fadeStop (opacity) {
  let animates = [
    Animated.timing(opacity, {
      toValue: 0,
      ...config,
    }),
  ]
  return animates
}

function zoomStart (opacity, translateX, translateY, scaleX, scaleY) {
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

function zoomStop (fromTransform, opacity, translateX, translateY, scaleX, scaleY) {
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

function marginStart (marginValue) {
  let animates = [
    Animated.spring(marginValue, {
      toValue: 0,
      friction: 9,
      duration: 200,
      useNativeDriver: false,
    }),
  ]
  return animates
}

function marginStop (marginValue, marginValueTo) {
  let animates = [
    Animated.spring(marginValue, {
      toValue: marginValueTo,
      friction: 9,
      duration: 150,
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
