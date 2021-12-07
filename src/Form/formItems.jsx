/*
 * PageName:
 * Description:
 */
import { Input, TimePicker, DatePicker, Radio, InputNumber, Switch, Cascader, Checkbox } from 'antd'
import { Unit, Editor, Select, TreeSelect, RangeNumber, Upload, Custom } from '../'

export default function (props) {
  let { item, values, form, key, modal } = props
  switch (item.type) {
    case 'Label':
      return typeof item.render == 'function' ? (
        item.render({ item, values })
      ) : (
        <label {...item}>{values && values[item.name]}</label>
      )
    case 'InputNumber':
      return <InputNumber {...item} key={key} />
    case 'Select':
      return <Select modal={modal} {...item} key={key} />
    case 'TimePicker':
      return <TimePicker {...item} key={key} />
    case 'DatePicker':
      return <DatePicker {...item} key={key} />
    case 'RangePicker':
      return <DatePicker.RangePicker {...item} key={key} />
    case 'TextArea':
      return <Input.TextArea {...item} key={key} />
    case 'Unit':
      return <Unit {...item} key={key} />
    case 'Upload':
      return (<Upload {...item} key={key} />)
    case 'Radio':
      return (<Radio.Group buttonStyle="solid" optionType='button' {...item} key={key} />)
    case 'Checkbox':
      return (<Checkbox.Group {...item} key={key} />)
    case 'Switch':
      return (<Switch {...item} key={key} />)
    case 'Editor':
      return (<Editor {...item} key={key} />)
    case 'TreeSelect':
      return (<TreeSelect {...item} key={key} />)
    case 'Cascader':
      return (<Cascader {...item} key={key} />)
    case 'RangeNumber':
      return (<RangeNumber {...item} key={key} />)
    case 'Custom':
      return <Custom {...item} key={key} />
    default:
      return <Input {...item} key={key} />
  }
}
