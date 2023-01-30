import React, { useRef, useCallback, forwardRef, FC } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { disappearCompleted, OverlayPointerEvents, popRefType } from '../common/Common'
import { scaleSize } from '../common/SetSize'

import PullView from '../PullView'

interface IProps {
    modal: boolean;
    animated: boolean;
    overlayPointerEvents: OverlayPointerEvents;
    isBackPress: boolean;
    overlayOpacity: number;
    barStyles?: StyleProp<ViewStyle>;
    onDisappearCompleted?: () => void;
    onCloseRequest?: () => void;
    label: string;
    labelVal: string;
    items?: { [x: string]: any }[];
    cancel?: () => void;
    confirm?: (item: { [x: string]: any }, index: React.Key) => void;
}

interface ActionSheetProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const ActionSheetView: FC<ActionSheetProps> = (props) => {
  let { cancel, confirm, onDisappearCompleted } = props
  let popRef = useRef<popRefType>(null)

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
      <View style={{ backgroundColor: '#fff', borderRadius: scaleSize(10), maxHeight: scaleSize(300) }}>
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
        <Text style={{ fontSize: scaleSize(14), color: '#333', fontWeight: '500' }}>
        取消
        </Text>
      </TouchableOpacity>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (<View style={{ height: insets?.bottom }} />)}
      </SafeAreaInsetsContext.Consumer>
    </PullView>
  )
}

const Component = ActionSheetView
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef(({
  overlayPointerEvents = 'auto',
  ...other
}: Partial<IProps>, ref) => {
  const initProps = {
    modal: false,
    animated: true,
    overlayPointerEvents,
    isBackPress: true,
    overlayOpacity: 0.55,
    useDark: false,
    label: 'label',
    labelVal: 'value',
    containerStyle: {
      backgroundColor: 'transparent',
    },
    ...other,
  }

  return (
    <Component {...initProps} refInstance={ref} />
  )
})
