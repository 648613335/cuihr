/*
 * PageName: 弹窗和保单组合
 * Description:
 */
import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { useSelector, useDispatch } from 'umi'
import { Modal, Button } from 'antd'
import { Form as Forms } from '@/components'
import Style from './style.less'

let formsGroup = ''

function ModalButton(props) {
  let { form, modal, button, refs } = props
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.loading)
  const { layout = 'vertical' } = modal
  const [values, setValues] = useState(null)
  const formRef = useRef()

  useEffect(() => {
    if (visible) {
      formsGroup = formRef.current.form
      formsGroup.setFieldsValue(values || form?.initialValues)
    }
  }, [visible])

  useEffect(() => {
    if (typeof modal?.visible == 'boolean') {
      setVisible(modal?.visible)
    }
  }, [modal?.visible])

  // 提供给父级调用 
  useImperativeHandle(refs, () => ({ form: formsGroup }))

  /**
   * FunctionName: 点击确认
   * Description:
   */
  function onOk() {
    formsGroup.validateFields().then((values) => {
      let payload
      if (props.payloadafter) {
        payload = { ...(modal?.saveFetch?.payload || {}), ...values }
      } else {
        payload = { ...values, ...modal?.saveFetch?.payload || {} }
      }
      // 调用接口前，用于改变参数
      payload = (modal?.handleOkBefore ? modal?.handleOkBefore(payload) : payload)
      if (modal?.saveFetch) {
        dispatch({ ...modal?.saveFetch, payload }).then((result) => {
          if (result?.status == 200) {
            // 调用接口后
            setVisible(modal?.handleOk({ values, forms: formsGroup }))
            // 重置所有
            // formsGroup.resetFields()
          }
        })
      } else {
        const returnobj = modal?.handleOk({ values, forms: formsGroup })
        if (!!returnobj && (typeof returnobj === 'object' || typeof returnobj === 'function') && typeof returnobj.then === 'function') {
          returnobj.then(res => {
            console.log(res)
            setVisible(res)
          })
        } else {
          setVisible(returnobj)
        }
        // 重置所有
        // formsGroup.resetFields()
      }
    })
  }

  /**
   * FunctionName: 关闭弹窗
   * Description: 
   */
  function onCancel() {
    if (modal.handleCancel) {
      return setVisible(modal.handleCancel({}))
    }
    setVisible(false)
    // 重置所有
    // formsGroup.resetFields()
  }

  /**
   * FunctionName: 打开弹窗按钮
   * Description: 
   */
  function buttonClick() {
    if (typeof button?.handleClick == 'function') {
      const returnobj = button?.handleClick()
      if (!!returnobj && (typeof returnobj === 'object' || typeof returnobj === 'function') && typeof returnobj.then === 'function') {
        returnobj.then(res => setVisible(res))
      } else {
        setVisible(returnobj)
      }
    } else if (button?.fetch) {
      // 点击打开弹窗前调用接口，例如 详情
      dispatch(button?.fetch).then((result) => {
        if (result) {
          let data = button?.callback(result)
          setValues(data)
          setVisible(true)
        }
      })
    } else {
      setVisible(true)
    }
  }
  form = form || {}

  let confirmLoading = modal?.confirmLoading ? modal?.confirmLoading : loading?.effects && loading?.effects['common/edit']

  return (
    <div style={{ display: layout == 'vertical' ? 'block' : 'inline-block' }}>
      <Button type="primary" onClick={buttonClick} {...button}>
        {button.name}
      </Button>
      <Modal
        forceRender
        maskClosable={false}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        okText="确定"
        cancelText="取消"
        destroyOnClose={true}
        centered={true}
        {...modal}
        footer={modal.footer ? (formsGroup => modal.footer(formRef))() : undefined}
        
      >
        {modal.top && modal.top()}
        <div className={Style.modalCnt}>
          {/* visible == true 才允许加载form 是为了关闭弹窗的时候移除form组件，里面的子组件不会在初始化 */}
          {
            visible && form &&
            <Forms
              type='modal'
              refs={formRef}
              modal={{
                ...modal,
                visible,
              }}
              {...form}
              extend={modal?.extend}
            />
          }
        </div>
        {modal.bottom && modal.bottom()}
        {/* <Form
            name="form"
            className={Style.form}
            form={formRef}
            // initialValues={form?.initialValues}
            onValuesChange={(changedValues, allValues) => {
              typeof form?.handleChange == 'function' &&
                form?.handleChange({ changedValues, allValues })
            }}
          >
            {show()}
          </Form> */}
      </Modal>
    </div >
  )
}
export default forwardRef(ModalButton)