/*
 * PageName: 下拉+接口
 * Description:
 */
import { useEffect, useState } from 'react'
import { Select, notification } from 'antd'
import { useSelector, useDispatch, history } from 'umi'

export default function (props) {
    let {
        fetch,
        labelvalue = {},
        isSelect = null,// 默认带有请选择
        options = [],
        optionsChange = (values) => (values),// 对 接口返回的数据进行修改
        modal,
        initfirst = false
    } = props
    const dispatch = useDispatch()
    const [selectData, setSelectData] = useState([])
    const loading = useSelector((state) => state.loading)

    useEffect(() => {
        if (fetch) {// 有接口 并且是 打开状态
            query()
        }
    }, [])

    useEffect(() => {
        if (options.length > 0) {
            let data = [...options]
            if (isSelect) {
                data?.unshift(isSelect)
            }
            setSelectData([...data])
        }
    }, [options])


    /**
    * FunctionName: 下路数据查询
    * Description: 
    */
    function query() {
        dispatch(fetch).then((result) => {
            if (result) {
                let data = result.data
                data = optionsChange(data)
                data = data?.map((item) => ({ ...item, label: item[labelvalue.label], value: item[labelvalue.value] }))
                if (isSelect) {
                    data.unshift(isSelect)
                }
                if (initfirst) {
                    props.onChange && props.onChange(data[0]['value'])
                }
                setSelectData([...data])
            }
        })
    }

    if (!Array.isArray(selectData)) {
        notification.error({
            message: `select下拉`,
            description: '数据格式不正确',
        })
        return ''
    }

    return (
        <div>
            <Select disabled={loading.effects[fetch?.type]} loading={loading.effects[fetch?.type]} optionFilterProp="label"  {...props} options={selectData} />
        </div>
    )
}
