/*
 * PageName: form上传
 * Description: 
 */
import { useState, useEffect } from 'react'
import { Upload, Button } from 'antd'

export default function (props) {
    let { onChange, handleChange, listType, value = '', action } = props
    let upload = {
        name: 'file',
        action: action,
        headers: {
            authorization: 'authorization-text',
        },
        maxCount: 1,
        ...props
    }
    const [fileList, setFileList] = useState([])

    useEffect(() => {
        setFileList(value || [])
    }, [value])

    /**
     * FunctionName: 上传
     * Description: 
     * param {*} info
     */
    function onUpload(info) {
        if (info.file.status !== 'uploading') { }
        if (info.file.status === 'done') { }
        else if (info.file.status === 'error') { }

        typeof handleChange == 'function' && handleChange(info)

        if (info.file?.response?.status == 200) {
            info.fileList = info.fileList.map((item) => {
                // 将 接口返回数据和本地数据融合，方便外部操作
                return { ...item, ...item?.response?.data }
            })
        }
        onChange(info.fileList)
    }
    /**
     * FunctionName: 删除
     * Description: 
     * param {*} params
     */
    function onRemove(file) {
        let list = fileList.filter((item) => item.uid != file.uid)
        onChange(list)
    }
    return (
        <div>
            {
                Array.isArray(fileList) ? <Upload fileList={fileList} showUploadList={true} {...upload} onChange={onUpload} onRemove={onRemove}>
                    {listType == 'picture-card' ? <img src={value[0]?.url} alt="avatar" style={{ width: '100%' }} /> : <Button>上传文件</Button>}
                </Upload> : ''
            }
            <div className='red'>非密系统，请勿上传涉密文件</div>
        </div>
    )
}
