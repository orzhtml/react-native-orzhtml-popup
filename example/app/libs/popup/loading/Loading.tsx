import React, { forwardRef, useRef, useImperativeHandle, useState, FC } from 'react'
import { Text, Image, ActivityIndicator, ImageStyle, StyleProp, TextStyle, ImageSourcePropType, useColorScheme } from 'react-native'
import { useDarkMode } from 'react-native-dynamic'

import { scaleSizeFool, setSpText } from '../common/SetSize'

import PView from '../PView'

const darkColor = '#191D26'

interface IProps {
    title?: string | null | number;
    color?: string;
    icon?: ImageSourcePropType | null;
    iconStyle?: StyleProp<ImageStyle>;
    titleStyle?: StyleProp<TextStyle>;
    size?: number | 'small' | 'large' | undefined;
    overlayOpacity?: number;
}

interface LoadingProps extends IProps {
    refInstance: React.ForwardedRef<any>;
}

const LoadingView: FC<LoadingProps> = (props) => {
  const popRef = useRef(null)
  const [title, setTitle] = useState(props.title || null)
  const currentMode = useColorScheme()
  const indicatorColor = currentMode ? (currentMode === 'dark' ? '#fff' : darkColor) : props.color
  const stylesIndicatorColor = indicatorColor
  const stylesTitleColor = indicatorColor

  useImperativeHandle(props.refInstance, () => ({
    updateTitle: (_title: string) => {
      setTitle(_title)
    },
  }))

  const renderIcon = () => {
    let { icon, iconStyle, size } = props
    console.log('stylesIndicatorColor:', stylesIndicatorColor)

    if (icon) {
      return (<Image source={icon} style={iconStyle} />)
    } else {
      return (<ActivityIndicator color={stylesIndicatorColor} size={size} />)
    }
  }

  const renderText = () => {
    let { titleStyle } = props
    let _title_ = null
    if (typeof title === 'string' || typeof title === 'number') {
      _title_ = (
        <Text
          style={[{
            fontSize: setSpText(16),
            color: stylesTitleColor,
            marginTop: scaleSizeFool(10),
          }, titleStyle]}
        >{title}</Text>
      )
    }

    return _title_
  }

  return (
    <PView
      ref={popRef}
      style={{ justifyContent: 'center', alignItems: 'center' }}
      modal={true}
      animated={false}
      overlayOpacity={props.overlayOpacity}
      isBackPress={false}
    >
      { renderIcon() }
      { renderText() }
    </PView>
  )
}

const Component = LoadingView
// ????????????????????????Component?????????ref;????????????????????????refInstance????????????????????????
export default forwardRef((props: Partial<IProps>, ref) => {
  const initProps = {
    ...props,
  }
  return (
    <Component {...initProps} refInstance={ref} />
  )
})
