/*
 * PageName: 详情列表
 * Description:
 */
import { Descriptions } from 'antd';
import Style from './style.less'

export default function (props) {
    let { data, labelStyle, ...rest } = props

    function show() {
        return data.map((item, index, array) => {
            return (
                <Descriptions.Item label={item.label} key={index}>
                    {
                        typeof item.render == 'function' ? item.render(item, index, array) : item.text
                    }
                </Descriptions.Item>
            )
        })
    }

    return (
        <Descriptions {...rest} className={Style.desc} labelStyle={{ justifyContent: 'flex-end', minWidth: 70, ...labelStyle }}>
            {show()}
        </Descriptions>
    );
}
