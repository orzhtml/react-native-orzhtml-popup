import React, { useCallback, useEffect, useRef } from 'react'
import { View, DeviceEventEmitter } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'

interface ElementInterface {
    key: React.Key,
    element: React.ReactNode,
}

function Popup () {
  let [state, setState] = useSingleState<{ elements: ElementInterface[] }>({
    elements: [],
  })
  const elementsRef = useRef<ElementInterface[]>([])

  const add = (e: ElementInterface) => {
    let elems = [...elementsRef.current]
    elems.push(e)
    elementsRef.current = elems
    setState({ elements: elems })
  }

  const remove = (e: ElementInterface) => {
    let elems = [...elementsRef.current]
    for (let i = elems.length - 1; i >= 0; --i) {
      if (elems[i].key === e.key) {
        elems.splice(i, 1)
        break
      }
    }
    elementsRef.current = elems
    setState({ elements: elems })
  }

  const removeAll = useCallback(() => {
    elementsRef.current = []
    setState({ elements: [] })
  }, [])

  useEffect(() => {
    const listeners = [
      DeviceEventEmitter.addListener('addPopup', add),
      DeviceEventEmitter.addListener('removePopup', remove),
      DeviceEventEmitter.addListener('removeAllPopup', removeAll),
    ]

    return () => listeners.forEach(e => e.remove())
  }, [add, remove, removeAll])

  if (state.elements.length === 0) {
    return null
  }

  return (
    <>
      {state.elements.map((item: ElementInterface) => {
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
