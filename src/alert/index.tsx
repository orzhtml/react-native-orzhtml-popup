import React from 'react'
import { Keyboard } from 'react-native'

import { AlertOptions } from '../common/Common'

import Overlay from '../Overlay'
import AlertView from './Alert'

function Alert (title: string | React.ReactNode, options?: AlertOptions) {
  let key = 0

  if (!title) {
    console.error('Title can not be empty')
    return null
  }

  const { message, buttons, onOk, onCancel, okText = '确认', cancelText = '取消', alertOptions = {} } = options || {}
  let _buttons = buttons || []

  if (_buttons.length === 0) {
    if (onOk || onCancel) {
      _buttons.push({
        text: cancelText, style: 'cancel', onPress: onCancel,
      }, { text: okText, style: 'default', onPress: onOk })
    } else {
      _buttons.push({ text: okText, style: 'default' })
    }
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
}

Alert.AlertKey = [0]

function remove (key: React.Key) {
  for (let i = Alert.AlertKey.length - 1; i >= 0; --i) {
    if (Alert.AlertKey[i] === key) {
      Alert.AlertKey.splice(i, 1)
      break
    }
  }
}

export default Alert
