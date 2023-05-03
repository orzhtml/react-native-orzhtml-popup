# react-native-orzhtml-popup

### Alert 提示框

##### 参数
* `title`：弹窗标题，可以为字符串或者 React 组件。
* `options`：弹窗配置选项，具体选项如下：

参数名称 | 类型 | 默认值 | 描述
------ | ------ | ------ | ------
`message`|	`string` 或 `React.ReactNode`|`-`|弹窗的提示信息，可以为字符串或者 React 组件。
`onOk`|`() => void`|`-`|确认按钮点击后的回调。
`okText`| `string` | `确认` |确认按钮的文本内容。
`onCancel`|`() => void`|`-`|取消按钮点击后的回调。
`cancelText`|`string`|取消|取消按钮的文本内容。
`buttons`|`AlertButtonType[]`|`[]`|弹窗的按钮组。
`alertOptions`|`{ only?: boolean, modal?: boolean, type?: 'zoomIn' | 'zoomOut' | 'fade' | 'custom' | 'none' }`|`{ only: true, modal: true, type: 'zoomIn' }`|弹窗的配置选项。

`AlertButtonType`
参数
* `banClosed`：是否禁止关闭弹窗，默认为 false。
* `onPress`：按钮点击后的回调函数。
* `style`：按钮的样式类型，可选值为 default、cancel、warning。
* `text`：按钮的文本内容


