/*
 * PageName: 详情卡片区域
 * Description:
 */
import { Space, Card, Button, Spin } from 'antd';
import Style from './style.less'

export default function (props) {
    let { extra, btns } = props;

    /**
     * FunctionName: 按钮列表
     * Description:
     */
    function buttons() {
        return (
            <Space>
                {
                    btns.map((item, key) => {
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
            </Space>
        );
    }

    return (
        <div className={Style.card}>
            <Card {...props} extra={Array.isArray(btns) ? buttons() : extra}>
                {props.children}
            </Card>
        </div>
    );
}
