import React, { useRef, useCallback, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { disappearCompleted, initViewProps, IProps, PullVHandleRef } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'

interface CProps<T> extends IProps {
    onDisappearCompleted?: () => void;
    onCloseRequest?: () => void;
    label: string;
    labelVal: string;
    items?: T[];
    cancel?: () => void;
    confirm?: (item: T, index: number) => void;
    cancelText?: string,
}

function ActionSheetView<T> (props: CProps<T>) {
  let { cancel, confirm, onDisappearCompleted } = props
  const [maxHeight, setMaxHeight] = useState(500)
  let PullVRef = useRef<PullVHandleRef>(null)
  const _insets = useSafeAreaInsets()

  useEffect(() => {
    setMaxHeight(Dimensions.get('window').height - (_insets.bottom + _insets.top + 70))
  }, [_insets.bottom, _insets.top])

  const hide = useCallback(() => {
    if (props.modal) {
      return null
    }
    PullVRef.current?.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted, props.modal])

  const onCancel = useCallback(() => {
    PullVRef.current?.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [onDisappearCompleted, cancel])

  const onConfirm = useCallback((item: T, index: number) => {
    PullVRef.current?.close(() => {
      disappearCompleted(() => {
        confirm && confirm(item, index)
      }, onDisappearCompleted)
    })
  }, [confirm, onDisappearCompleted])

  return (
    <PullView
      ref={PullVRef}
      containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      onCloseRequest={hide}
      side="bottom"
      modal={props.modal}
      isBackPress={false}
    >
      <SafeAreaView edges={['bottom', 'top']}>
        <ScrollView style={{
          backgroundColor: '#fff',
          borderRadius: scaleSize(10),
          maxHeight: maxHeight,
        }}>
          {
            props.items?.map((item, index) => {
              let text = typeof item === 'string' ? item : item[props.label]
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={{
                    borderBottomWidth: index !== (props.items?.length || 0) - 1 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: '#ccc',
                  }}
                  onPress={() => onConfirm(text, index)}
                >
                  <View style={{
                    height: scaleSize(50),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: scaleSize(14),
                      color: '#333',
                      fontWeight: '500',
                    }}>{text}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
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
          <Text style={{
            fontSize: scaleSize(14),
            color: '#333',
            fontWeight: '500',
          }}>{props.cancelText}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </PullView>
  )
}

function ActionSheet<T> (props: Partial<CProps<T>>) {
  const initProps: CProps<T> = {
    ...initViewProps,
    label: 'label',
    labelVal: 'value',
    cancelText: '取消',
    ...props,
  }

  return (
    <ActionSheetView {...initProps} />
  )
}

export default ActionSheet
