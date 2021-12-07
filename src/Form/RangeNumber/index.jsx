/*
 * PageName: 输入范围
 * Description:
 */
import { useEffect, useState } from 'react'
import { Input, InputNumber } from 'antd'
import { useDispatch } from 'umi'

export default function (props) {
    let {
        onChange,
        value = {},
        minAttr = {},
        maxAttr = {},
    } = props
    const dispatch = useDispatch()
    const [selectData, setSelectData] = useState([])

    function handleChange({ val, type }) {
        onChange({ ...value, [type]: val })
    }

    return (
        <Input.Group compact>
            <InputNumber
                {...minAttr}
                style={{ width: 100, textAlign: 'center' }}
                placeholder="最小值"
                value={value['min']}
                onChange={(val) => handleChange({ val, type: 'min' })} />
            <Input
                className="site-input-split"
                style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                }}
                placeholder="~"
                disabled
            />
            <InputNumber
                {...maxAttr}
                className="site-input-right"
                style={{ width: 100, textAlign: 'center', }}
                placeholder="最大值"
                value={value['max']}
                onChange={(val) => handleChange({ val, type: 'max' })}
            />
        </Input.Group>
    )
}
