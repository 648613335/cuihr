/*
 * PageName: 列表按钮
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { Popover, Badge } from 'antd'
import Style from './style.less'

function TableBtns(props) {
  const {
    data,
    outCount = 100, // 外层显示个数
    show = true
  } = props
  // 过滤所有show=false的数据
  let filterData = data.filter((item) => {
    return item.show || !('show' in item)
  })
  let out = [],
    inner = []
  if (filterData && filterData.length > 0) {
    out = filterData.slice(0, outCount)
    inner = filterData.slice(outCount, filterData.length)
  }

  /**
   * FunctionName: 隐藏列
   * Author: 崔皓然
   * Description:
   */
  function popoverList() {
    return (
      <ul className={Style.menuChild}>
        {inner.map((item, i) => {
          if (item.show == undefined || item.show) {
            return (
              <li key={i} onClick={item.onClick}>
                {item.name ||
                  (typeof item.render == 'function' && item.render())}
              </li>
            )
          }
        })}
      </ul>
    )
  }

  return (
    <>
      {
        show === true ? <div className={Style.tablebtns}>
          {out.map((item, i, arr) => {
            let isI = <span className={Style.i}>|</span>
            if (item.show == undefined || item.show) {
              // 最后一个竖杠是否显示
              if (i == arr.length - 1 && inner.length <= 0) {
                isI = ''
              }
              return (
                <div className={Style.li} key={i}>
                  {(typeof item.render == 'function' && item.render()) || (
                    <a key={i} {...item}>
                      {item.name}
                    </a>
                  )}
                  {isI}
                </div>
              )
            }
          })}
          {inner.length > 0 ? (
            <>
              <Popover
                placement="bottom"
                content={popoverList()}
                trigger="click"
                overlayClassName={Style.overlayClassName}
              >
                <a className={Style.dian}>
                  <Badge color="#3154EC"></Badge>
                  <Badge color="#3154EC"></Badge>
                  <Badge color="#3154EC"></Badge>
                </a>
              </Popover>
            </>
          ) : ('')}
        </div> : ''
      }
    </>
  )
}

export default TableBtns
