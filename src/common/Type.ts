import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type OverlayPointerEvents = 'none' | 'box-only' | 'auto' | undefined;

export type ToastPosition = 'center' | 'top' | 'bottom' | undefined;

export type durationType = 'short' | 'long' | number

export type popoverArrow = 'none' | 'topLeft' | 'top' | 'topRight' |
    'rightTop' | 'right' | 'rightBottom' |
    'bottomRight' | 'bottom' | 'bottomLeft' |
    'leftBottom' | 'left' | 'leftTop';

export type AlertButtonType = {
    onPress?: (() => void) | undefined,
    style?: 'default' | 'cancel' | 'warning',
    text: string,
}

export interface AlertOptions {
    message?: string | React.ReactNode,
    onOk?: () => void,
    okText?: string,
    onCancel?: () => void,
    cancelText?: string,
    buttons?: AlertButtonType[],
    alertOptions?: {
        only?: boolean,
        modal?: boolean,
        type?: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none',
    },
}

export type fromBoundsType = { x: number, y: number, width: number, height: number }

export type headerLayoutsType = {
    none: ViewStyle,
    topLeft: ViewStyle,
    top: ViewStyle,
    topRight: ViewStyle,
    rightTop: ViewStyle,
    right: ViewStyle,
    rightBottom: ViewStyle,
    bottomRight: ViewStyle,
    bottom: ViewStyle,
    bottomLeft: ViewStyle,
    leftBottom: ViewStyle,
    left: ViewStyle,
    leftTop: ViewStyle,
}

export type popRefType = { close: (animated?: boolean | (() => void), onCloseCallback?: () => void) => void }
export interface PopoverHandleRef {
    updateFromBounds: (bounds: fromBoundsType) => void,
    close: (animated?: boolean | (() => void), onCloseCallback?: () => void) => void,
}
export interface PVHandleRef {
    close: (animated?: boolean | (() => void), onCloseCallback?: () => void) => void,
}
export interface PopHandleRef {
    close: (onCloseCallback?: () => void) => void,
}
export interface PullVHandleRef {
    close: (onCloseCallback?: () => void) => void,
}
export interface LoadingHandleRef {
    updateTitle: (title: string) => void,
}

export interface IProps {
    modal: boolean,
    animated: boolean,
    overlayPointerEvents: OverlayPointerEvents;
    isBackPress: boolean,
    overlayOpacity: number,
    useDark: boolean,
    zIndex?: number,
}

export interface ActionSheetProps<T> {
    items: T[];
    confirm: (item: T, index: number) => void;
    cancel?: () => void;
    options?: {
        label?: string;
        labelVal?: string;
        cancelText?: string,
    }
}

export interface IDatePickerOptions {
    max: string,
    min: string,
    showYear: boolean,
    showMonth: boolean,
    showDay: boolean,
    leftBtnText: string,
    rightBtnText: string,
    yearText: string,
    monthText: string,
    dayText: string,
}

export interface IDatePickerProps {
    value: string;
    confirm: (date: string) => void;
    options?: Partial<IDatePickerOptions>
}

export interface IPullPickerProps<T> {
    items: T[],
    value: string | number,
    confirm: (val: string | number, index: number) => void,
    options?: Partial<IPullPickerOptions>,
}

export interface IPullPickerOptions {
    label: string,
    labelVal: string,
    wheelHeight: number,
    all?: boolean,
    allText: string,
    allVal: string | number,
    cancelText?: string,
    completeText?: string,
    itemStyle?: StyleProp<TextStyle>,
}

export interface PopupDefaultLabels {
    alert?: {
        okText?: string,
        cancelText?: string,
        btnColor?: {
            default: string,
            cancel: string,
            warning: string,
        },
    },
    actionSheet?: {
        cancelText: string,
    },
    datePicker?: {
        leftBtnText: string,
        rightBtnText: string,
        yearText: string,
        monthText: string,
        dayText: string,
    },
    pullPicker?: {
        allText: string,
        cancelText: string,
        completeText: string,
    },
}
