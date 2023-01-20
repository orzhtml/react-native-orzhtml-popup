import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import { Text, Image, ActivityIndicator } from 'react-native'
import { useDarkMode } from 'react-native-dynamic'

import { initViewProps, defaultProps } from '../libs/Common'
import { scaleSizeFool, setSpText } from '../libs/SetSize'

import PView from '../PView'

const darkColor = '#191D26'

const LoadingView = forwardRef((props, ref) => {
  const isDark = useDarkMode()
  const propsData = defaultProps(props, initViewProps)
  const popRef = useRef(null)
  const [title, setTitle] = useState(props.title || null)
  const indicatorColor = isDark ? '#fff' : propsData.color || '#fff'
  const titleColor = '#212121'
  const stylesIndicatorColor = indicatorColor
  const stylesTitleColor = indicatorColor

  useImperativeHandle(ref, () => ({
    updateTitle: (_title) => {
      setTitle(_title)
    },
  }))

  const renderIcon = () => {
    let { icon, iconStyle, size } = propsData
    if (icon) {
      return (<Image source={icon} style={iconStyle} />)
    } else {
      return (<ActivityIndicator color={stylesIndicatorColor} size={size} />)
    }
  }

  const renderText = () => {
    let { titleStyle } = propsData
    let _title_ = null
    if (typeof title === 'string' || typeof title === 'number') {
      _title_ = (
        <Text
          style={[{
            fontSize: setSpText(16),
            color: stylesTitleColor,
            marginTop: scaleSizeFool(10),
          }, titleStyle]}
        >{title}</Text>
      )
    }

    return _title_
  }

  return (
    <PView
      ref={popRef}
      style={{ justifyContent: 'center', alignItems: 'center' }}
      modal={true}
      animated={false}
      overlayOpacity={propsData.overlayOpacity}
      isBackPress={false}
    >
      { renderIcon() }
      { renderText() }
    </PView>
  )
})

export default LoadingView
