import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Overlay } from '@app/libs/popup'

const PullDemo = () => {
  const [tabs] = useState([{
    id: 1,
    name: 'Pull bottom',
    onPress: async () => {
      _showPullView('bottom')
    },
  }, {
    id: 2,
    name: 'Pull Top',
    onPress: () => {
      _showPullView('top')
    },
  }, {
    id: 3,
    name: 'Pull left',
    onPress: () => {
      _showPullView('left')
    },
  }, {
    id: 4,
    name: 'Pull right',
    onPress: () => {
      _showPullView('right')
    },
  }])
  const _showPullView = (size: 'bottom' | 'top' | 'left' | 'right' | undefined) => {
    let overlayView = (
      <Overlay.PullView
        containerStyle={[{
          borderTopLeftRadius: size === 'bottom' ? 15 : 0,
          borderTopRightRadius: size === 'bottom' ? 15 : 0,
          borderBottomLeftRadius: size === 'top' ? 15 : 0,
          borderBottomRightRadius: size === 'top' ? 15 : 0,
        },
        size === 'bottom' || size === 'top' ? {
          height: 400,
        } : null,
        size === 'left' || size === 'right' ? {
          width: 240,
        } : null]}
        side={size}
      >
        <View style={{
          backgroundColor: 'red',
          borderTopLeftRadius: size === 'bottom' ? 15 : 0,
          borderTopRightRadius: size === 'bottom' ? 15 : 0,
          borderBottomLeftRadius: size === 'top' ? 15 : 0,
          borderBottomRightRadius: size === 'top' ? 15 : 0,
          flex: 1,
          padding: 15,
        }}>
          {size !== 'bottom' && (<View style={{ height: 50 }} />)}
          <Text>!23</Text>
        </View>
      </Overlay.PullView>
    )
    Overlay.show(overlayView)
  }
  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingRight: 10,
      marginTop: 20,
    }}>
      {
        tabs.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id + index}
              style={{
                borderWidth: 1,
                borderColor: '#999',
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginLeft: 10,
                marginBottom: 10,
              }}
              onPress={item.onPress}
            >
              <Text style={{ color: '#999' }}>{item.name}</Text>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}

export default PullDemo
