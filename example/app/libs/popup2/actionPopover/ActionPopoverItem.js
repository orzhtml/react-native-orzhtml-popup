import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, PixelRatio } from 'react-native'

import { setSpText } from '../libs/SetSize'

const pixelSize = (function () {
  let pixelRatio = PixelRatio.get()
  if (pixelRatio >= 3) return 0.3333333333333333
  else if (pixelRatio >= 2) return 0.5
  else return 1
})()

const ActionPopoverItem = (props) => {
  const renderTitle = () => {
    let { title } = props

    if ((title || title === '' || title === 0) && !React.isValidElement(title)) {
      let textStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: '#fff',
        fontSize: setSpText(14),
      }
      title = <Text style={textStyle} numberOfLines={1}>{title}</Text>
    }

    return title
  }

  let { style, title, leftSeparator, rightSeparator, ...others } = props

  style = [{
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: '#ccc',
    borderLeftWidth: leftSeparator ? pixelSize : 0,
    borderRightWidth: rightSeparator ? pixelSize : 0,
  }].concat(style)

  return (
    <TouchableOpacity style={style} {...others}>
      {renderTitle()}
    </TouchableOpacity>
  )
}

ActionPopoverItem.propTypes = {
  ...TouchableOpacity.propTypes,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
  leftSeparator: PropTypes.bool,
  rightSeparator: PropTypes.bool,
}

ActionPopoverItem.defaultProps = {
  ...TouchableOpacity.defaultProps,
}

export default ActionPopoverItem
