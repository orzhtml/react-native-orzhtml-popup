import { useColorSchemeContext } from 'react-native-dynamic'

interface IDynamicValue<T> {
    light: T,
    dark: T,
}

export function useDynamic<T> (light: T | IDynamicValue<T>, dark?: T): T {
  const mode = useColorSchemeContext()
  if (arguments.length > 1) {
    return mode === 'dark' ? dark! : (light as T)
  } else {
    return (light as IDynamicValue<T>)[mode]
  }
}
