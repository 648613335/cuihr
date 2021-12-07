/*
 * PageName: 列表
 * Description:
 */

import { Table, Pagination, Space, Button } from 'antd'
import Style from './style.less'

export default function (props) {
  let { headerLt = '', table, pagination, btns } = props

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
            )
          }).filter(Boolean)
        }
      </Space>
    )
  }

  return (
    <div className={Style.cont} style={table.marginTop != undefined ? { marginTop: table.marginTop } : null}>
      {
        btns || headerLt ? <div className={Style.header}>
          <div className={Style.lt}>{headerLt}</div>
          <div className={Style.rt}>{Array.isArray(btns) ? buttons() : btns}</div>
        </div> : ''
      }
      <Table pagination={false} {...table} />
      {pagination && (
        <div className={Style.pagination}>
          <Pagination
            showSizeChanger={false}
            showTitle={false}
            defaultCurrent={1}
            defaultPageSize={10}
            // showTotal={total => `${pagination.current}/${total}`}
            {...pagination}
          // showQuickJumper
          />
        </div>
      )}
    </div>
  )
}
