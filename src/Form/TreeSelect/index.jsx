/*
 * PageName: tree下拉+接口
 * Description:
 */
import { useEffect, useState } from 'react'
import { TreeSelect } from 'antd'
import { useSelector, useDispatch, history } from 'umi'

export default function (props) {
    let {
        fetch,
        isSelect = null,// 默认不带有请选择
        value = [],
    } = props
    if (typeof value == 'string' && value.indexOf(',') != -1) {
        value = value.split(',')
    }
    const dispatch = useDispatch()
    const [treeData, setTreeData] = useState(props.treeData)

    useEffect(() => {
        if (fetch) {
            query()
        } else {
            if (isSelect) {
                let data = [...treeData]
                data.unshift(isSelect)
                setTreeData(data)
            }
        }
        return () => {
            setTreeData([])
        }
    }, [])

    /**
    * FunctionName: 供应商
    * Description: 
    */
    function query() {
        if (fetch) {
            dispatch(fetch).then((result) => {
                if (result?.data) {
                    let data = result.data
                    if (isSelect) {
                        data.unshift(isSelect)
                    }
                    if (typeof props.format == 'function') {
                        data = props.format(data)
                    }
                    setTreeData(data)
                }
            })
        }
    }

    return (
        <div>
            <TreeSelect treeNodeFilterProp="title" treeData={treeData} {...props} value={value} />
        </div>
    )
}
