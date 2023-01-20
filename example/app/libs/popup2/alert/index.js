import React from 'react'
import { Keyboard } from 'react-native'

import { isArray, isObject } from '../libs/Common'
import Overlay from '../Overlay'
import AlertView from './AlertView'

function Alert (title, message, buttons = [], options = { only: true, modal: true, type: 'zoomOut' }) {
  let key = 0
  // console.log('message:', message)
  if (title === null || title === undefined || title === '' || isArray(title) || isObject(title)) {
    console.error('title 不能为空')
    return null
  }
  if (isArray(message)) {
    if (isObject(buttons)) {
      options = buttons
    }
    buttons = message
    message = null
  } else if (isObject(message)) {
    options = message
    buttons = []
    message = null
  }

  if (buttons.length === 0) {
    buttons = [{ text: '确定' }]
  }

  if (options.only === undefined) {
    options.only = true // 如果为空，默认 true
  }

  if (options.modal === undefined) {
    options.modal = true // 如果为空，默认 true
  }

  if (options.only && Alert.AlertKey[0]) {
    return Alert.AlertKey
  }

  let props = {
    title: title,
    message: message,
    buttons: buttons,
    ...options,
    onClose: () => {
      remove(key)
    },
  }

  Keyboard.dismiss()

  key = Overlay.show(<AlertView {...props} />)

  Alert.AlertKey.push(key)
}

Alert.AlertKey = []

function remove (key) {
  for (let i = Alert.AlertKey.length - 1; i >= 0; --i) {
    if (Alert.AlertKey[i] === key) {
      Alert.AlertKey.splice(i, 1)
      break
    }
  }
}

export default Alert
