import React from 'react'
import { Keyboard } from 'react-native'

import type { IPullPickerProps } from '../common/Type'
import Overlay from '../Overlay'
import PullPickerView from './PullPickerView'

class PullPicker {
  static allText = '请选择'
  static cancelText = '取消'
  static completeText = '确定'
  static show<T> ({ items, value, confirm, options }: IPullPickerProps<T>) {
    Keyboard.dismiss()

    const {
      allText = this.allText,
      cancelText = this.cancelText,
      completeText = this.completeText,
      ...other
    } = options || {}

    let key = Overlay.show(
      <PullPickerView
        items={items}
        value={value}
        confirm={confirm}
        allText={allText}
        cancelText={cancelText}
        completeText={completeText}
        {...other}
      />,
    )

    return key
  }
}

export const setPullPickerPopupDefaultLabels = (options: {
  allText: string,
  cancelText: string,
  completeText: string,
 }) => {
  PullPicker.allText = options.allText
  PullPicker.cancelText = options.cancelText
  PullPicker.completeText = options.completeText
}

export default PullPicker
