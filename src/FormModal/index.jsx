/*
 * PageName: 弹窗和保单组合
 * Description:
 */
import { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'umi'
import { Modal, Button } from 'antd'
import { Form as Forms } from '../Form'
import Style from '../ModalButton/style.less'

export default function ModalButton(props) {
  let { refs, modal: modalProps = {}, form: formProps = {} } = props
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.loading)
  const [form, setForm] = useState({})
  const [modal, setModal] = useState({})
  const formRef = useRef()
  let formsGroup = formRef.current?.form


  /**
   * FunctionName: 显示隐藏显示
   * Author: 崔皓然
   * Description: 
   * 外部调用：refs.current.isShow({...})
   */
  function formModal({ visible = false, reset = false, values = null, form = null, modal = null }) {
    // 初始化
    reset && formsGroup.resetFields()
    // 弹窗和form 属性
    form && setForm({ ...formProps, ...form })
    modal && setModal({ ...modalProps, ...modal })
    // 赋值
    values && formsGroup.setFieldsValue(values)
    setVisible(visible)
  }

  // 提供给父级调用 
  useImperativeHandle(refs, () => ({ form: formsGroup, formModal }))

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
            formsGroup.resetFields()
          }
        })
      } else {
        const returnobj = modal?.handleOk({ values, forms: formsGroup })
        if (!!returnobj && (typeof returnobj === 'object' || typeof returnobj === 'function') && typeof returnobj.then === 'function') {
          returnobj.then(res => setVisible(res))
        } else {
          setVisible(returnobj)
        }
      }
    })
  }

  let modalItem = { ...modalProps, ...modal }
  let formItem = { ...formProps, ...form }
  return (
    <div>
      <Modal
        forceRender
        maskClosable={false}
        visible={visible}
        onOk={onOk}
        onCancel={() => {
          setVisible(false)
          formsGroup.resetFields()
        }}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading.effects[modalItem.saveFetch?.type]}
        {...modalProps}
        {...modalItem}
        footer={modalItem.footer ? (formsGroup => modalItem.footer(formsGroup))() : undefined}
      >
        {modalItem.top && modalItem.top()}
        <div className={Style.modalCnt}>
          <Forms
            type='modal'
            refs={formRef}
            modal={{
              ...modalItem,
              visible,
            }}
            {...formProps}
            {...formItem}
            extend={modalItem?.extend}
          />
        </div>
        {modalItem.bottom && modalItem.bottom()}
      </Modal>
    </div>
  )
}