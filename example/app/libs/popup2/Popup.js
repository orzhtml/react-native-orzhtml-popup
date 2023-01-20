import React, { useState, useEffect, useRef } from 'react'
import { View, DeviceEventEmitter } from 'react-native'

const Popup = () => {
  const [elements, setElems] = useState([])
  const _elementsRef = useRef([])

  const add = (e) => {
    let elems = [..._elementsRef.current]
    elems.push(e)
    _elementsRef.current = elems
    setElems(elems)
  }

  const remove = (e) => {
    let elems = [..._elementsRef.current]
    for (let i = elems.length - 1; i >= 0; --i) {
      if (elems[i].key === e.key) {
        elems.splice(i, 1)
        break
      }
    }
    _elementsRef.current = elems
    setElems(elems)
  }

  const removeAll = () => {
    setElems([])
  }

  useEffect(() => {
    const listeners = [
      DeviceEventEmitter.addListener('addPopup', add),
      DeviceEventEmitter.addListener('removePopup', remove),
      DeviceEventEmitter.addListener('removeAllPopup', removeAll),
    ]

    return () => listeners.forEach(e => e.remove())
  }, [])

  return (
    <>
      {
        elements.map((item, index) => {
          return (
            <View
              key={'PopupView' + item.key}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              pointerEvents='box-none'
            >
              {item.element}
            </View>
          )
        })
      }
    </>
  )
}

Popup.PopKey = 0

Popup.add = function (element) {
  let key = ++Popup.PopKey
  DeviceEventEmitter.emit('addPopup', { key, element })
  return key
}

Popup.remove = function (key) {
  DeviceEventEmitter.emit('removePopup', { key })
}

Popup.removeAll = function () {
  DeviceEventEmitter.emit('removeAllPopup')
}

export default Popup
