/*
 * PageName: 导入
 * Description: 
 */
import { useState } from 'react'
import { Modal, Spin, Button, Upload, message, notification } from 'antd'
import { useSelector, useDispatch, history } from 'umi'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import Style from './style.less'
import Config from '@/utils/config'

export default function (props) {
    let {
        title = '导入',
        handleClick,
        handleOk,
        handleCancel,
        button,
        url,
        templateUrl = '',
        done = () => { },
        children,
        href,
        api = Config.DOMAINNAME.lcy + '/',
        payload = [],
        isMessage = true
    } = props
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    let urlParms = `${payload.map((item) => {
        return `&&${item.key}=${item.value}`
    })}`.split(',').join('')

    /**
     * FunctionName: 弹窗
     * Description: 
     */
    function onClick() {
        setVisible(typeof handleOk == 'function' ? handleClick({ values, form }) : true)
    }

    function onCancel() {
        setVisible(typeof handleOk == 'function' ? handleCancel({ values, form }) : false)
    }

    /**
     * FunctionName: 上传
     * Description: 
     */
    const upload = {
        name: 'file',
        action: `${api}${url}?token=${localStorage.token}${urlParms}`.replace("\xe2\x80\x8b", ''),
        // data: {
        //     operateId: localStorage.userId,
        //     priceSheetId: 10,
        //     supplierId: 8
        // },
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: (file, fileList) => {
            setLoading(true)
        },
        onChange(info) {
            let file = info.file
            if (file.status !== 'uploading') {
                console.log('uploading')
            }
            if (file.status === 'done') {
                console.log('done')
                if (file.response.status != 200) {
                    isMessage && message.error(file.response.msg)
                } else {
                    isMessage && message.success('导入成功，请等待数据更新')
                }
                let data = done(info)
                setVisible(typeof done == 'function' ? (data === undefined ? false : data) : false)
                setLoading(false)
            } else if (file.status === 'error') {
                console.log('error')
                notification.error({
                    message: `请求错误 ${file.error.status}: ${url}`,
                    description: file.error.message,
                })
            }
            console.log('结束')
        },
    }

    return (
        <div>
            <Button type="primary" {...button} onClick={onClick}>{button?.name || children || '导入'}</Button>
            <Modal title={title} visible={visible} onCancel={onCancel} cancelText='取消' footer={null} destroyOnClose={true}>
                <Spin indicator={<LoadingOutlined />} tip='下载中，处理中' spinning={loading}>
                    <div className={Style.cnt}>
                        <Upload {...upload}>
                            <Button type='primary' block icon={<UploadOutlined />}>导入</Button>
                        </Upload>
                        <div className='red'>非密系统，请勿上传涉密文件</div>
                        <a target='_blank' href={href || `${api}${templateUrl}?token=${localStorage.token}`}>下载模板</a>
                    </div>
                </Spin>
            </Modal>
        </div>
    )
}
