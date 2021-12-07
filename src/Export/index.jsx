/*
 * PageName: 导出
 * Description: 
 */
import { useState } from 'react'
import { Modal, Spin, Button } from 'antd'
import { useSelector, useDispatch, history } from 'umi'
import { LoadingOutlined } from '@ant-design/icons';
import Style from './style.less'
import qs from 'qs'

export default function (props) {
    let { title = '导出', handleClick, handleOk, handleCancel, button, url, payload,  children, host = '' } = props
    const [visible, setVisible] = useState(false)
    let params = qs.stringify(payload) && '&' + qs.stringify(payload)

    // for (const key in payload) {
    //     params += `&${key}=${payload[key]}`
    // }
    const link = `${host + '/' + url}?token=${localStorage.token}${params}`
    /**
     * FunctionName: 弹窗
     * Description: 
     */
    function onClick() {
        setVisible(typeof handleClick == 'function' ? handleClick() : true)
    }

    function onOk() {
        setVisible(typeof handleOk == 'function' ? handleOk() : false)
    }

    function onCancel() {
        setVisible(typeof handleCancel == 'function' ? handleCancel() : false)
    }

    return (
        <div>
            <Button type="primary" {...button} onClick={onClick}>{button?.name || children || '导出'}</Button>
            <Modal title={title} visible={visible} onOk={onOk} onCancel={onCancel} okText='确定' cancelText='取消' footer={null}>
                <div>
                    <Spin indicator={<LoadingOutlined />} tip='下载中，请稍等' spinning={false}>
                        <a className='ant-btn ant-btn-primary ant-btn-block' target='_brank' href={link.replace("\xe2\x80\x8b", '')}>点击下载</a>
                    </Spin>
                </div>
            </Modal>
        </div>
    )
}
