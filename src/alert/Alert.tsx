import React, { FC, useRef } from 'react'
import { ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, View, Dimensions } from 'react-native'

import { disappearCompleted, initViewProps } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import type { AlertButtonType, IProps, PopHandleRef } from '../common/Type'
import PopView from '../PopView'
import dynamicStyles from '../style'

interface CProps extends IProps {
  type: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none',
  onDisappearCompleted?: () => void,
  title?: string | React.ReactNode,
  message?: string | React.ReactNode,
  titleStyle?: StyleProp<TextStyle>,
  messageStyle?: StyleProp<TextStyle>,
  onClose?: () => void,
  buttons?: AlertButtonType[],
  btnColor?: {
    default: string,
    cancel: string,
    warning: string,
  },
}

const AlertView: FC<CProps> = (props) => {
  const currentMode = useColorScheme()
  const styles = props.useDark && currentMode ? dynamicStyles[currentMode] : dynamicStyles.light
  const {
    title, message, buttons, titleStyle, messageStyle,
    btnColor = {
      default: '#1ACB79',
      cancel: '#3E3E3E',
      warning: '#FF5363',
    },
  } = props
  let PopRef = useRef<PopHandleRef>(null)

  const hide = () => {
    if (props.modal) {
      return null
    }
    PopRef.current?.close(() => {
      props.onClose && props.onClose()
      disappearCompleted(props.onDisappearCompleted)
    })
  }

  const close = (fn: (() => void) | undefined) => {
    PopRef.current?.close(() => {
      props.onClose && props.onClose()
      disappearCompleted(fn, props.onDisappearCompleted)
    })
  }

  return (
    <PopView
      ref={PopRef}
      type={props.type}
      animated={props.animated}
      onCloseRequest={hide}
    >
      <View style={{
        width: '82%',
        backgroundColor: styles.defaultBg,
        borderRadius: scaleSize(10),
        minHeight: Dimensions.get('window').height - 300
      }}>
        <ScrollView style={{
          flex: 1,
          padding: scaleSize(15),
          marginTop: scaleSize(10),
        }}>
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
                  StyleSheet.flatten(titleStyle),
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
                  }, StyleSheet.flatten(messageStyle)]}
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
            buttons?.map((btn: AlertButtonType, i: number) => {
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
                    close(btn.onPress)
                  }}
                >
                  <Text style={{
                    fontSize: scaleSize(16),
                    color: btnColor[btn.style || 'default'],
                  }}>
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

function Alert (props: Partial<CProps>) {
  const initProps: CProps = {
    ...initViewProps,
    type: 'zoomIn',
    ...props,
  }

  return (
    <AlertView {...initProps} />
  )
}

export default Alert
