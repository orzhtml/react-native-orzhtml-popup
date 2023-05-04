import React, { FC } from 'react'
import { View, Text, Image, StyleProp, ViewStyle, StyleSheet, ImageSourcePropType } from 'react-native'

import { initViewProps, IProps } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PView from '../PView'

const imagesIcons: {
  success: ImageSourcePropType | undefined,
} = {
  success: require('../icons/toast_success.png'),
}

interface CProps extends IProps {
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    contentStyle?: StyleProp<ViewStyle>,
    position: 'top' | 'center' | 'bottom',
    text?: string | number | React.ReactNode,
    icon?: 'success' | 'fail' | 'smile' | 'sad' | 'info' | 'stop' | React.ReactNode,
}

const ToastView: FC<CProps> = props => {
  const renderIcon = () => {
    let { icon } = props
    if (!icon) return null

    let image: React.ReactNode
    if (!React.isValidElement(icon)) {
      let imageSource: ImageSourcePropType | undefined
      switch (icon) {
        case 'success':
          imageSource = imagesIcons.success
          break
        case 'fail':
          imageSource = imagesIcons.success
          break
        case 'smile':
          imageSource = imagesIcons.success
          break
        case 'sad':
          imageSource = imagesIcons.success
          break
        case 'info':
          imageSource = imagesIcons.success
          break
        case 'stop':
          imageSource = imagesIcons.success
          break
        default: break
      }
      image = (
        <Image
          style={{ width: scaleSize(40), height: scaleSize(40), tintColor: '#ddd' }}
          source={imageSource}
        />
      )
    } else {
      image = icon
    }
    return (
      <View style={{ paddingTop: scaleSize(8), paddingBottom: scaleSize(8) }}>
        {image}
      </View>
    )
  }

  const renderText = () => {
    let { text } = props
    if (typeof text === 'string' || typeof text === 'number') {
      text = (
        <Text style={{
          color: '#fff',
          fontSize: scaleSize(14),
          lineHeight: scaleSize(20),
          textAlign: 'justify',
        }}>{text}</Text>
      )
    }
    return text
  }

  const buildStyle = () => {
    let { style, position } = props
    let _style: ViewStyle = {
      paddingLeft: scaleSize(40),
      paddingRight: scaleSize(40),
      paddingTop: scaleSize(160),
      paddingBottom: scaleSize(160),
      justifyContent: position === 'top' ? 'flex-start' : (position === 'bottom' ? 'flex-end' : 'center'),
      alignItems: 'center',
    }

    return StyleSheet.compose(_style, StyleSheet.flatten(style))
  }

  const contentStyle = StyleSheet.flatten(props.contentStyle)

  return (
    <PView
      style={buildStyle()}
      animated={false}
      overlayOpacity={0}
      isBackPress={false}
      overlayPointerEvents='none'
    >
      <View
        style={StyleSheet.compose({
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingLeft: scaleSize(12),
          paddingRight: scaleSize(12),
          paddingTop: scaleSize(8),
          paddingBottom: scaleSize(8),
          borderRadius: scaleSize(4),
          alignItems: 'center',
        }, contentStyle)}
      >
        { renderIcon() }
        { renderText() }
      </View>
    </PView>
  )
}

function Toast (props: Partial<CProps>) {
  const initProps: CProps = {
    ...initViewProps,
    position: 'center',
    ...props,
  }

  return (
    <ToastView {...initProps} />
  )
}

export default Toast
