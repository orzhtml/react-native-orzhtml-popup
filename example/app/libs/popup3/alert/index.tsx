import React from 'react'
import { Keyboard } from 'react-native'

import { AlertButtonType, isArray, isObject } from '../common/Common'
import Overlay from '../Overlay'
import AlertView from './Alert'

interface AlertOptions {
    only?: boolean;
    modal?: boolean;
    type?: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none';
}

function Alert (title: string | React.ReactNode, message?: string | React.ReactNode | AlertButtonType[] | AlertOptions, buttons?: AlertButtonType[] | AlertOptions, options?: AlertOptions) {
  let key = 0

  if (title === null || title === undefined || title === '' || isArray(title) || isObject(title)) {
    console.error('title 不能为空')
    return null
  }
  let _message: string | React.ReactNode | AlertButtonType[] | AlertOptions = message
  let _buttons: any = buttons || []
  let _options: any = options || {}

  if (isArray(message)) {
    if (isObject(buttons)) {
      _options = buttons
    }
    _buttons = message
    _message = ''
  } else if (isObject(message)) {
    _options = message
    _buttons = []
    _message = ''
  } else if (typeof message === 'string' || React.isValidElement(message)) {
    _message = message
  }

  if (_buttons && _buttons.length === 0) {
    _buttons = [{ text: '确定' }]
  }

  if (_options?.only === undefined) {
    _options.only = true // 如果为空，默认 true
  }

  if (_options?.modal === undefined) {
    _options.modal = true // 如果为空，默认 true
  }

  if (_options?.only && Alert.AlertKey[0]) {
    return Alert.AlertKey
  }

  let props = {
    title: title,
    message: _message,
    buttons: _buttons,
    ..._options,
    onClose: () => {
      remove(key)
    },
  }

  Keyboard.dismiss()

  key = Overlay.show(<AlertView {...props} />)

  Alert.AlertKey.push(key)
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
