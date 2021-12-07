/*
 * PageName: form组件
 * Description:
 */
import { useImperativeHandle, useEffect, forwardRef } from 'react'
import { Button, Form, Space, Descriptions } from 'antd'
import FormItems from './formItems'
import Style from './style.less'

export default function (props) {
  let {
    items = [], // 数据
    buttons = [],
    refs,
    type = 'modal',//排列方式 modal 弹窗 竖向，search 查询 横向
    extend,
    formLayout = {},
    initialValues,
    modal,// 弹窗属性
  } = props

  const [form] = Form.useForm()
  // 提供给父级调用 form
  useImperativeHandle(refs, () => ({ form: { ...form } }))

  /**
   * FunctionName: form表单列
   * Description:
   * param {*} item
   * param {*} key
   */
  function fItems({ item, key }) {
    if (item) {
      const { colon = true } = item
      return (
        <div>
          <Form.Item
            {...item}
            key={key}
            label={item.label}
            name={item.name}
            rules={item.rules || [{ required: false, message: '' }]}
            colon={colon}
            initialValue={item.initialValue}
            valuePropName={item.valuePropName}
          >
            {/* {typeof item.before == 'function' ? item.before() : item.before} */}
            {FormItems({ item, values: { ...initialValues, ...form.getFieldsValue() }, form, key, modal })}
            {/* {typeof item.after == 'function' ? item.after() : item.after} */}
          </Form.Item>
          {typeof item.extend == 'function' ? item.extend() : item.extend}
        </div >
      )
    }
    return item
  }

  /**
   * FunctionName: form显示
   * Description:
   */
  function show() {
    return items.map((item, key) => {
      if (item) {
        if (Array.isArray(item)) {
          return (
            <div key={key} className={Style.cell}>
              {
                item.map((obj, i) => {
                  if (obj) {
                    return fItems({ item: obj, key: i })
                  }
                  return obj
                }).filter(Boolean)
              }
            </div>
          )
        } else {
          return fItems({ item, key })
        }
      } else {
        return item
      }
    })
  }
  return (
    <div>
      <Form
        {...{
          // labelCol: { span: 4 },
          // wrapperCol: { span: 20 },
          ...formLayout
        }}
        initialValues={initialValues}
        name="form"
        form={form}
      >
        <Space className={`${Style.cnt} form_cnt ${type == 'modal' ? Style.column : ''}`}>
          <Space className={`form_item`}>{show()}</Space>
          {typeof extend == 'function' ? extend({ form }) : extend}
          {
            Array.isArray(buttons) && buttons?.length > 0 ? <Space className={`form_btns`}>
              {
                buttons.map((item, key) => {
                  if (typeof item.render == 'function') {
                    return item.render({ item, values, form })
                  }
                  return (
                    <Form.Item key={key}>
                      <Button
                        type="primary"
                        {...item}
                        onClick={() => {
                          form.validateFields().then((values) => {
                            item.onClick({ item, values, form })
                          })
                        }}
                      >
                        {item.name}
                      </Button>
                    </Form.Item>
                  )
                })
              }
            </Space> : buttons
          }
        </Space>
      </Form>
    </div>
  )
}
