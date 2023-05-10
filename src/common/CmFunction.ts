import { setActionSheetPopupDefaultLabels } from '../actionSheet'
import { setAlertPopupDefaultLabels } from '../alert'
import { setDatePickerPopupDefaultLabels } from '../datePicker'
import { setPullPickerPopupDefaultLabels } from '../pullPicker'

import type { PopupDefaultLabels } from './Type'

export const setPopupDefaultLabels = (options: PopupDefaultLabels) => {
  if (options.alert) {
    setAlertPopupDefaultLabels(options.alert)
  }
  if (options.actionSheet) {
    setActionSheetPopupDefaultLabels(options.actionSheet)
  }
  if (options.datePicker) {
    setDatePickerPopupDefaultLabels(options.datePicker)
  }
  if (options.pullPicker) {
    setPullPickerPopupDefaultLabels(options.pullPicker)
  }
}
