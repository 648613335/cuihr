/*
 * PageName:
 * Branch: 0629
 * Autor: 崔皓然
 * Description:
 */
import Style from './style.less'
import { Button, Space } from 'antd'

export default function (props) {
    let { data } = props

    /**
     * FunctionName: 按钮列表
     * Description:
     */
    function buttons() {
        return (
            <>
                {
                    data.map((item, key) => {
                        if (item.show === false) {
                            return undefined
                        }
                        return typeof item.render == 'function' ? (
                            item.render(item, key)
                        ) : (
                            <Button key={key} type='primary' {...item}>
                                {item.name}
                            </Button>
                        );
                    }).filter(Boolean)
                }
            </>
        );
    }

    return (
        <Space className={Style.footBtns}>
            {buttons()}
        </Space>
    )
}
