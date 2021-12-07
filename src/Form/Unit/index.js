/*
 * PageName: 数字和下拉组合
 * Description: 
 */
import { useState } from 'react'
import { InputNumber, Select } from 'antd'
import Style from './style.less'

export default function (props) {
    let { number = {}, select = {}, onChange, value = {} } = props

    function onInput(val) {
        typeof onChange == 'function' && onChange({ ...value, number: val })
    }

    function onSelect(val) {
        typeof onChange == 'function' && onChange({ ...value, select: val })
    }

    return (
        <div className={Style.unit}>
            <InputNumber onChange={onInput} value={value.number} {...number} />
            <Select onChange={onSelect} value={value.select} {...select} />
        </div>
    )
}
