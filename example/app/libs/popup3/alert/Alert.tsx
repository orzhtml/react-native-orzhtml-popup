import React, { FC, forwardRef, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StyleProp, TextStyle, useColorScheme } from 'react-native'

import { disappearCompleted, btnColor, OverlayPointerEvents, AlertButtonType, popRefType } from '../common/Common'
import { scaleSize } from '../common/SetSize'

import PopView from '../PopView'
import dynamicStyles from '../style'

interface IProps {
    modal: boolean;
    animated: boolean;
    overlayPointerEvents: OverlayPointerEvents;
    isBackPress: boolean;
    useDark: boolean;
    overlayOpacity: number;
    type?: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none';
    onDisappearCompleted?: () => void;
    title?: string | React.ReactNode;
    message?: string | React.ReactNode;
    titleStyle?: StyleProp<TextStyle>;
    messageStyle?: StyleProp<TextStyle>;
    onClose?: () => void;
    buttons?: AlertButtonType[]
}

interface AlertProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const AlertView: FC<AlertProps> = (props) => {
  const currentMode = useColorScheme()
  const styles = props.useDark && currentMode ? dynamicStyles[currentMode] : dynamicStyles.light
  const { title, message, buttons, titleStyle, messageStyle } = props
  let popRef = useRef<popRefType>(null)

  const hide = () => {
    if (props.modal) {
      return null
    }
    popRef.current?.close(() => {
      props.onClose && props.onClose()
      disappearCompleted(props.onDisappearCompleted)
    })
  }

  const close = (fn: (() => void) | undefined) => {
    popRef.current?.close(() => {
      props.onClose && props.onClose()
      disappearCompleted(fn, props.onDisappearCompleted)
    })
  }

  return (
    <PopView
      ref={popRef}
      type={props.type}
      animated={props.animated}
      onCloseRequest={hide}
    >
      <View style={{ width: '72%', backgroundColor: styles.defaultBg, borderRadius: scaleSize(5) }}>
        <ScrollView style={{ padding: scaleSize(15), marginTop: scaleSize(10) }}>
          {
            typeof title === 'string' ? (
              <View style={{ marginBottom: scaleSize(15), alignItems: 'center' }}>
                <Text style={[
                  {
                    fontSize: scaleSize(16),
                    color: styles.alertTitle,
                    fontWeight: '500',
                    lineHeight: scaleSize(20),
                    textAlign: 'center',
                  },
                  titleStyle,
                ]}>{title}</Text>
              </View>
            ) : title
          }
          {
            typeof message === 'string' ? (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[{
                    fontSize: scaleSize(14),
                    color: styles.alertMsgColor,
                    textAlign: 'center',
                    lineHeight: scaleSize(20),
                  }, messageStyle]}
                >{message}</Text>
              </View>
            ) : message
          }
        </ScrollView>
        <View
          style={{
            height: scaleSize(48),
            width: '100%',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: 'rgba(0, 0, 0, 0.2)',
            flexDirection: 'row',
          }}
        >
          {
            buttons?.map((btn: AlertButtonType, i: React.Key) => {
              let key = 'btn-' + i
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={1}
                  style={{
                    flex: 1,
                    height: scaleSize(48),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftColor: 'rgba(0, 0, 0, 0.2)',
                    borderLeftWidth: i > 0 ? StyleSheet.hairlineWidth : 0,
                  }}
                  onPress={() => {
                    if (btn.banClosed) {
                      btn.onPress && btn.onPress()
                    } else {
                      close(btn.onPress)
                    }
                  }}
                >
                  <Text style={{ fontSize: scaleSize(16), color: btnColor[btn.style || 'default'] }}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
    </PopView>
  )
}

const Component = AlertView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef(({
  overlayPointerEvents = 'auto',
  type = 'zoomIn', // 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none' | undefined
  ...other
}: Partial<IProps>, ref) => {
  const initProps = {
    modal: false,
    animated: true,
    overlayPointerEvents,
    isBackPress: true,
    overlayOpacity: 0.55,
    useDark: false,
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
