import React, { useRef, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { initViewProps, initActionSheetProps, defaultProps, disappearCompleted } from '../libs/Common'
import { scaleSize } from '../libs/SetSize'
import PullView from '../PullView'

const ActionSheetView = (props) => {
  const propsData = defaultProps(props, { ...initViewProps, ...initActionSheetProps })
  let { cancel, confirm, onDisappearCompleted } = propsData
  let popRef = useRef(null)

  const hide = useCallback(() => {
    // console.log('ActionSheetView hide')
    if (propsData.modal) {
      return null
    }
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted, propsData.modal])

  const onCancel = useCallback(() => {
    // console.log('ActionSheetView onCancel')
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [onDisappearCompleted, cancel])

  const onConfirm = useCallback((item, index) => {
    // console.log('ActionSheetView onConfirm')
    popRef && popRef.current && popRef.current.close(() => {
      disappearCompleted(() => confirm(item, index), onDisappearCompleted)
    })
  }, [confirm, onDisappearCompleted])

  return (
    <PullView
      ref={popRef}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      onCloseRequest={hide}
      side="bottom"
      modal={propsData.modal}
      isBackPress={false}
    >
      <View style={{ backgroundColor: '#fff', borderRadius: scaleSize(10), maxHeight: scaleSize(300) }}>
        {
          propsData.items.map((item, index) => {
            let text = typeof item === 'string' ? item : item[propsData.label]
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                style={{
                  borderBottomWidth: index !== propsData.items.length - 1 ? StyleSheet.hairlineWidth : 0,
                  borderBottomColor: '#ccc',
                }}
                onPress={() => onConfirm(item, index)}
              >
                <View style={{ height: scaleSize(50), justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: scaleSize(14), color: '#333', fontWeight: '500' }}>{text}</Text>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          marginTop: scaleSize(10),
          height: scaleSize(50),
          backgroundColor: '#fff',
          borderRadius: scaleSize(10),
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onCancel}
      >
        <Text style={{ fontSize: scaleSize(14), color: '#333', fontWeight: '500' }}>取消</Text>
      </TouchableOpacity>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ height: insets.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

export default ActionSheetView
