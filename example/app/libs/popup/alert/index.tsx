import React from 'react'
import { Keyboard } from 'react-native'

import type { AlertOptions } from '../common/Type'
import Overlay from '../Overlay'
import AlertView from './Alert'

function Alert (title: string | React.ReactNode, options?: AlertOptions) {
  let key = 0

  if (!title) {
    console.error('Title can not be empty')
    return null
  }

  const {
    message, buttons, onOk, onCancel,
    okText = Alert.defaultProps.okText, cancelText = Alert.defaultProps.cancelText,
    alertOptions = {},
  } = options || {}
  const _buttons = buttons || [
    (onCancel || onOk) ? {
      text: onOk ? okText : cancelText,
      style: onOk ? 'default' : 'cancel',
      onPress: onOk || onCancel,
    } : {
      text: okText,
      style: 'default',
    },
  ]
  if (onCancel && onOk) {
    _buttons.unshift({
      text: cancelText,
      style: 'cancel',
      onPress: onCancel,
    })
  }

  const { only = true, modal = true, type = 'zoomIn' } = alertOptions

  if (only && Alert.AlertKey[0]) {
    return Alert.AlertKey
  }

  let props = {
    title: title,
    message: message,
    buttons: _buttons,
    only,
    modal,
    type,
    onClose: () => {
      remove(key)
    },
  }

  Keyboard.dismiss()

  key = Overlay.show(<AlertView {...props} />)

  if (Alert.AlertKey.length === 1 && Alert.AlertKey[0] === 0) {
    Alert.AlertKey = [key]
  } else {
    Alert.AlertKey.push(key)
  }

  return Alert.AlertKey
}

Alert.AlertKey = [0]
Alert.defaultProps = {
  okText: '确认',
  cancelText: '取消',
}

Alert.remove = function (key: number) {
  Overlay.hide(key)
  remove(key)
}

Alert.removeAll = function () {
  Alert.AlertKey.map(key => {
    Alert.remove(key)
  })
}

function remove (key: number) {
  for (let i = Alert.AlertKey.length - 1; i >= 0; --i) {
    if (Alert.AlertKey[i] === key) {
      Alert.AlertKey.splice(i, 1)
      break
    }
  }
}

export const setAlertPopupDefaultLabels = (options: { okText: string, cancelText: string }) => {
  Alert.defaultProps.okText = options.okText
  Alert.defaultProps.cancelText = options.cancelText
}

export default Alert
