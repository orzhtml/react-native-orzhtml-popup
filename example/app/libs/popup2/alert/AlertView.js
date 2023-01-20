import React, { useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useDynamicValue } from 'react-native-dynamic'

import { initViewProps, initZoomProps, defaultProps, disappearCompleted, btnColor } from '../libs/Common'
import { scaleSizeFool, setSpText } from '../libs/SetSize'
import PopView from '../PopView'
import dynamicStyles from '../style'

const AlertView = (props) => {
  const styles = useDynamicValue(dynamicStyles)
  const propsData = defaultProps(props, { ...initViewProps, ...initZoomProps })
  const { title, message, buttons, titleStyle, messageStyle } = propsData
  let popRef = useRef(null)

  const hide = () => {
    // console.log('AlertView hide')
    if (propsData.modal) {
      return null
    }
    popRef && popRef.current && popRef.current.close(() => {
      propsData.onClose()
      disappearCompleted(propsData.onDisappearCompleted)
    })
  }

  const close = (fn) => {
    // console.log('AlertView close')
    popRef && popRef.current && popRef.current.close(() => {
      propsData.onClose()
      disappearCompleted(fn, propsData.onDisappearCompleted)
    })
  }

  return (
    <PopView
      ref={popRef}
      type={propsData.type}
      animated={propsData.animated}
      onCloseRequest={hide}
    >
      <View style={{ width: '72%', backgroundColor: styles.defaultBg, borderRadius: scaleSizeFool(5) }}>
        <ScrollView style={{ padding: scaleSizeFool(15), marginTop: scaleSizeFool(10) }}>
          {
            typeof title === 'string' ? (
              <View style={{ marginBottom: scaleSizeFool(15), alignItems: 'center' }}>
                <Text style={[
                  {
                    fontSize: setSpText(16),
                    color: styles.alertTitle,
                    fontWeight: '500',
                    lineHeight: scaleSizeFool(20),
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
                    fontSize: setSpText(14),
                    color: styles.alertMsgColor,
                    textAlign: 'center',
                    lineHeight: scaleSizeFool(20),
                  }, messageStyle]}
                >{message}</Text>
              </View>
            ) : message
          }
        </ScrollView>
        <View
          style={{
            height: scaleSizeFool(48),
            width: '100%',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: 'rgba(0, 0, 0, 0.2)',
            flexDirection: 'row',
          }}
        >
          {
            buttons.map((btn, i) => {
              let key = 'btn-' + i
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={1}
                  style={{
                    flex: 1,
                    height: scaleSizeFool(48),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftColor: 'rgba(0, 0, 0, 0.2)',
                    borderLeftWidth: i > 0 ? StyleSheet.hairlineWidth : 0,
                  }}
                  onPress={() => {
                    if (btn.banClosed) {
                      btn.onPress()
                    } else {
                      close(btn.onPress)
                    }
                  }}
                >
                  <Text style={{ fontSize: setSpText(16), color: btnColor[btn.style] || btnColor.default }}>
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

export default AlertView
