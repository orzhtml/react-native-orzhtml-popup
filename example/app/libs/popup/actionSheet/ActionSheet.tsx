import React, { useRef, useCallback, forwardRef, FC, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { disappearCompleted, initViewProps, IProps, popRefType } from '../common/Common'
import { scaleSize } from '../common/SetSize'
import PullView from '../PullView'

interface CProps extends IProps {
    onDisappearCompleted?: () => void;
    onCloseRequest?: () => void;
    label: string;
    labelVal: string;
    items?: { [x: string]: any }[];
    cancel?: () => void;
    confirm?: (item: { [x: string]: any } | string, index: React.Key) => void;
    cancelText?: string,
}

interface ActionSheetProps extends CProps {
    refInstance: React.ForwardedRef<any>;
}

const ActionSheetView: FC<ActionSheetProps> = (props) => {
  let { cancel, confirm, onDisappearCompleted } = props
  const [maxHeight, setMaxHeight] = useState(500)
  let popRef = useRef<popRefType>(null)
  const _insets = useSafeAreaInsets()

  useEffect(() => {
    setMaxHeight(Dimensions.get('window').height - (_insets.bottom + _insets.top + 70))
  }, [_insets.bottom, _insets.top])

  const hide = useCallback(() => {
    if (props.modal) {
      return null
    }
    popRef.current?.close(() => {
      disappearCompleted(onDisappearCompleted)
    })
  }, [onDisappearCompleted, props.modal])

  const onCancel = useCallback(() => {
    popRef.current?.close(() => {
      disappearCompleted(cancel, onDisappearCompleted)
    })
  }, [onDisappearCompleted, cancel])

  const onConfirm = useCallback((item: any, index: React.Key) => {
    popRef.current?.close(() => {
      disappearCompleted(() => {
        confirm && confirm(item, index)
      }, onDisappearCompleted)
    })
  }, [confirm, onDisappearCompleted])

  return (
    <PullView
      ref={popRef}
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
            props.items?.map((item: { [x: string]: any }, index: React.Key) => {
              let text = typeof item === 'string' ? item : item[props.label]
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={{
                    borderBottomWidth: index !== (props.items?.length || 0) - 1 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: '#ccc',
                  }}
                  onPress={() => onConfirm(item, index)}
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

const Component = ActionSheetView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: Partial<CProps>, ref) => {
  const initProps: CProps = {
    ...initViewProps,
    label: 'label',
    labelVal: 'value',
    cancelText: '取消',
    ...props,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
