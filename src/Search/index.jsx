/*
 * PageName: 搜索 * Description:
 */
import { useImperativeHandle, useRef } from 'react'
import { Button, Form, Space, Affix } from 'antd'
import Style from './style.less'
import { Form as Forms } from '../Form'

export default function (props) {
  let {
    items = [], // 数据
    handleSearch, // 查询
    handleReset, // 重置
    extraBtns = '',
    className,
    refs = () => { },
    hideReset,
    searchText,
    initialValues
  } = props
  const ref = useRef()
  // 获取Form组件的 form 对象
  let form = ref?.current?.form || {}

  // useEffect(() => {
  //   form = ref?.current?.form || {}
  // }, [ref])

  // 提供给父级调用 form
  // useImperativeHandle(refs, () => ({ form: { ...form } }))
  refs({ form })

  /**
   * FunctionName: 筛选
   * Author: 崔皓然
   * Description:
   */
  function onSearch() {
    // if (!form?.validateFields)
    form.validateFields && form.validateFields().then((values) => {
      // 筛选回调
      values.pageNumber = 1
      typeof handleSearch == 'function' && handleSearch({ values, form })
    }).catch((errorInfo) => { })
  }

  /**
   * FunctionName: 重置
   * Author: 崔皓然
   * Description:
   */
  function onReset() {
    if (typeof handleReset == 'function') {
      handleReset({ form })
    } else {
      // 重置所有
      form.resetFields()
    }
    onSearch()
  }
  return (
    // <Affix offsetTop={71}>
    <Affix>
      <div className={`${Style.search} ${className}`}>
        <Forms
          preserve={false}
          type='search'
          refs={ref}
          items={items}
          initialValues={initialValues}
          buttons={
            <>
              <Form.Item>
                <Button type="primary" onClick={onSearch}>
                  {searchText || "筛选"}
                </Button>
              </Form.Item>
              {!hideReset &&
                <Form.Item>
                  <Button type="default" onClick={onReset}>
                    重置
                  </Button>
                </Form.Item>
              }
              <Form.Item>
                {extraBtns}
              </Form.Item>
            </>
          }
        />
      </div>
    </Affix >
  )
}
