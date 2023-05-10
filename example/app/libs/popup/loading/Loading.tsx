import React, { forwardRef, useImperativeHandle, useState, FC } from 'react'
import { Text, Image, ActivityIndicator, ImageStyle, StyleProp, TextStyle, ImageSourcePropType, useColorScheme, StyleSheet } from 'react-native'

import { initViewProps } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import type { IProps, LoadingHandleRef } from '../common/Type'
import PView from '../PView'

const darkColor = '#191D26'

interface CProps extends IProps {
    title?: string | null | number,
    color?: string,
    size?: number | 'small' | 'large' | undefined,
    icon?: ImageSourcePropType | null,
    iconStyle?: StyleProp<ImageStyle>,
    titleStyle?: StyleProp<TextStyle>,
}

interface LoadingProps extends CProps {
    refInstance: React.ForwardedRef<LoadingHandleRef>,
}

const LoadingView: FC<LoadingProps> = (props) => {
  const [title, setTitle] = useState(props.title || null)
  const currentMode = useColorScheme()
  const indicatorColor = currentMode ? (currentMode === 'dark' ? '#fff' : darkColor) : props.color
  const stylesIndicatorColor = indicatorColor
  const stylesTitleColor = indicatorColor

  useImperativeHandle(props.refInstance, () => ({
    updateTitle: (_title: string) => {
      setTitle(_title)
    },
  }))

  const renderIcon = () => {
    let { icon, iconStyle, size } = props

    if (icon) {
      return (<Image source={icon} style={iconStyle} />)
    } else {
      return (<ActivityIndicator color={stylesIndicatorColor} size={size} />)
    }
  }

  const renderText = () => {
    const titleStyle = StyleSheet.flatten(props.titleStyle)
    let _title_ = null
    if (typeof title === 'string' || typeof title === 'number') {
      _title_ = (
        <Text
          style={[{
            fontSize: scaleSize(16),
            color: stylesTitleColor,
            marginTop: scaleSize(10),
          }, titleStyle]}
        >{title}</Text>
      )
    }

    return _title_
  }

  return (
    <PView
      style={{ justifyContent: 'center', alignItems: 'center' }}
      modal={true}
      animated={false}
      overlayOpacity={props.overlayOpacity}
      isBackPress={false}
      zIndex={props.zIndex}
    >
      { renderIcon() }
      { renderText() }
    </PView>
  )
}

const Component = LoadingView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef<LoadingHandleRef, Partial<IProps>>((props, ref) => {
  const initProps = {
    ...initViewProps,
    zIndex: 9999,
    ...props,
  }
  return (
    <Component {...initProps} refInstance={ref} />
  )
})
