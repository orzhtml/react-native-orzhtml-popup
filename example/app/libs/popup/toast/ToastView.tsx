import React, { FC, forwardRef } from 'react'
import { View, Text, Image, StyleProp, ViewStyle } from 'react-native'

import { OverlayPointerEvents, ToastPosition } from '../common/Common'
import { scaleSizeFool, setSpText } from '../common/SetSize'
import PView from '../PView'

const imagesIcons = {
  success: require('../icons/toast_success.png'),
}

interface IProps {
    modal: boolean;
    animated: boolean;
    overlayPointerEvents: OverlayPointerEvents;
    isBackPress: boolean;
    useDark: boolean;
    overlayOpacity: number;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    position: ToastPosition;
    contentStyle?: StyleProp<ViewStyle>;
    text?: string | number | React.ReactNode;
    icon?: string | number | React.ReactNode;
}

interface ToastVProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const ToastView: FC<ToastVProps> = (props) => {
  const buildStyle = () => {
    let { position } = props
    let _style_: ViewStyle = {
      paddingLeft: scaleSizeFool(40),
      paddingRight: scaleSizeFool(40),
      paddingTop: scaleSizeFool(160),
      paddingBottom: scaleSizeFool(160),
      justifyContent: position === 'top' ? 'flex-start' : (position === 'bottom' ? 'flex-end' : 'center'),
      alignItems: 'center',
    }

    return _style_
  }

  const renderText = () => {
    let { text } = props
    if (typeof text === 'string' || typeof text === 'number') {
      text = (
        <Text style={{
          color: '#fff',
          fontSize: setSpText(14),
          lineHeight: setSpText(20),
          textAlign: 'justify',
        }}>{text}</Text>
      )
    }
    return text
  }

  const renderIcon = () => {
    let { icon } = props
    if (!icon && icon !== 0) return null

    let image
    if (!React.isValidElement(icon)) {
      let imageSource
      if (typeof icon === 'string') {
        switch (icon) {
          case 'success':
            imageSource = imagesIcons.success
            break
            //   case 'fail':
            //     imageSource = imagesIcons.success
            //     break
            //   case 'smile':
            //     imageSource = imagesIcons.success
            //     break
            //   case 'sad':
            //     imageSource = imagesIcons.success
            //     break
            //   case 'info':
            //     imageSource = imagesIcons.success
            //     break
            //   case 'stop':
            //     imageSource = imagesIcons.success
            //     break
          default: imageSource = null; break
        }
      } else {
        imageSource = icon
      }
      image = (
        <Image
          style={{ width: scaleSizeFool(40), height: scaleSizeFool(40), tintColor: '#ddd' }}
          source={imageSource}
        />
      )
    } else {
      image = icon
    }
    return (
      <View style={{ paddingTop: scaleSizeFool(8), paddingBottom: scaleSizeFool(8) }}>
        {image}
      </View>
    )
  }

  return (
    <PView
      style={[buildStyle(), props.style]}
      animated={false}
      overlayOpacity={0}
      isBackPress={false}
      overlayPointerEvents='none'
    >
      <View
        style={[{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingLeft: scaleSizeFool(12),
          paddingRight: scaleSizeFool(12),
          paddingTop: scaleSizeFool(8),
          paddingBottom: scaleSizeFool(8),
          borderRadius: scaleSizeFool(4),
          alignItems: 'center',
        }, props.contentStyle]}
      >
        { renderIcon() }
        { renderText() }
      </View>
    </PView>
  )
}

const Component = ToastView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef(({
  overlayPointerEvents = 'auto',
  position = 'center',
  ...other
}: Partial<IProps>, ref) => {
  const initProps = {
    modal: false,
    animated: true,
    overlayPointerEvents,
    isBackPress: true,
    useDark: false,
    overlayOpacity: 0.55,
    position,
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
