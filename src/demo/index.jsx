import * as React from 'react';
import { useSelector, useDispatch } from 'umi'
import {  Button } from 'antd'

export default function (props) {
  let { refs, modal: modalProps = {}, form: formProps = {} } = props
  const [visible, setVisible] = React.useState('3443333333')
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.loading)
  const [form, setForm] = React.useState({})
  const [modal, setModal] = React.useState({})
  const formRef = React.useRef()
  let formsGroup = formRef.current?.form

  useEffect(() => {
    setVisible(22222222222222)
  }, [])
  return (
    <div>
      {visible}
    </div>
  )
}