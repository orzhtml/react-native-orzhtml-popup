import React from 'react'
import { View, Text, Image } from 'react-native'

import { initViewProps, initToastProps, defaultProps } from '../libs/Common'
import { scaleSize } from '../libs/SetSize'
import PView from '../PView'

const imagesIcons = {
  success: require('../icons/toast_success.png'),
}

const ToastView = (props) => {
  const propsData = defaultProps(props, { ...initViewProps, ...initToastProps })

  const renderIcon = () => {
    let { icon } = propsData
    if (!icon && icon !== 0) return null

    let image
    if (!React.isValidElement(icon)) {
      let imageSource
      if (typeof icon === 'string') {
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
          default: imageSource = null; break
        }
      } else {
        imageSource = icon
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
    let { text } = propsData
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
    let { style, position } = propsData
    let _style_ = [{
      paddingLeft: scaleSize(40),
      paddingRight: scaleSize(40),
      paddingTop: scaleSize(160),
      paddingBottom: scaleSize(160),
      justifyContent: position === 'top' ? 'flex-start' : (position === 'bottom' ? 'flex-end' : 'center'),
      alignItems: 'center',
    }].concat(style)

    return _style_
  }

  return (
    <PView
      style={buildStyle()}
      animated={false}
      overlayOpacity={0}
      isBackPress={false}
      overlayPointerEvents='none'
    >
      <View style={[{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingLeft: scaleSize(12),
        paddingRight: scaleSize(12),
        paddingTop: scaleSize(8),
        paddingBottom: scaleSize(8),
        borderRadius: scaleSize(4),
        alignItems: 'center',
      }, propsData.contentStyle]}>
        { renderIcon() }
        { renderText() }
      </View>
    </PView>
  )
}

export default ToastView
