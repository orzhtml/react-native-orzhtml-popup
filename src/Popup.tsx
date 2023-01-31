import React, { useState, useCallback, useEffect } from 'react'
import { View, DeviceEventEmitter } from 'react-native'

interface elementInterface {
    key: React.Key,
    element: React.ReactNode,
}

function Popup () {
  let [elements, setElems] = useState<elementInterface[]>([])

  const add = useCallback((e: elementInterface) => {
    let elems = [...elements]
    elems.push(e)
    setElems(elems)
  }, [elements])

  const remove = useCallback((e: elementInterface) => {
    let elems = [...elements]
    for (let i = elems.length - 1; i >= 0; --i) {
      if (elems[i].key === e.key) {
        elems.splice(i, 1)
        break
      }
    }
    setElems(elems)
  }, [elements])

  const removeAll = useCallback(() => {
    setElems([])
  }, [])

  useEffect(() => {
    const listeners = [
      DeviceEventEmitter.addListener('addPopup', add),
      DeviceEventEmitter.addListener('removePopup', remove),
      DeviceEventEmitter.addListener('removeAllPopup', removeAll),
    ]

    return () => listeners.forEach(e => e.remove())
  }, [add, remove, removeAll])

  if (elements.length === 0) {
    return null
  }

  return (
    <>
      {elements.map((item: elementInterface) => {
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
            pointerEvents="box-none"
          >
            {item.element}
          </View>
        )
      })}
    </>
  )
}

Popup.PopKey = 0

Popup.add = function (element: React.ReactNode) {
  let key = ++Popup.PopKey
  DeviceEventEmitter.emit('addPopup', { key, element })
  return key
}

Popup.remove = function (key: React.Key) {
  DeviceEventEmitter.emit('removePopup', { key })
}

Popup.removeAll = function () {
  DeviceEventEmitter.emit('removeAllPopup')
}

export default Popup
