/*
 * PageName: 页面
 * Description:
 */
import * as React from 'react'
import { Space, Button, Spin } from 'antd'
import Style from './style.less'
import { history } from 'umi'
import { PoweroffOutlined } from '@ant-design/icons'
import FootBtns from './footBtns'

export default function (props) {
  const formRef = React.useRef()

  let { children, title, right = [], btns = [], foot = null, loading = false, bgColor } = props

  /**
   * FunctionName: 按钮列表
   * Description:
   */
  function buttons(list) {
    return (
      <>
        {
          list.map((item, key) => {
            if (item.show === false) {
              return undefined
            }
            return typeof item.render == 'function' ? (
              item.render(item, key)
            ) : (
              <Button key={key} {...item}>
                {item.name}
              </Button>
            )
          }).filter(Boolean)
        }
      </>
    )
  }

  /**
   * FunctionName: 退出登录
   * Description: 
   */
  function signOut() {
    localStorage.clear()
    localStorage.url = window.location.pathname
    history.push('/login')
  }


  function editPwd() {
    formRef.current.formModal({
      visible: true,
      reset: true,
      modal: {
        title: '修改密码',
        saveFetch: {
          type: 'common/edit',
          api: 'Lcy/Account/AccountUpdatePassword',
          // payload: { id: record.id },
        },
        handleOk: ({ values, form }) => {
          return false
        },
        handleCancel: ({ values, form }) => {
          return false
        },
      },
    })
  }
  return (
    <div className={`${Style.page}`} style={{ backgroundColor: bgColor }}>
      <Spin spinning={loading}>
        {title !== false && (
          <header className={Style.header}>
            <div className={Style.lt}>
              {typeof title != 'string' ? (
                title
              ) : (
                <><label className={Style.title}>{title}</label><label className={Style.pwd}>非密系统</label></>
              )}
            </div>
            <div className={Style.rt}>
              <Space>
                {Array.isArray(btns) ? buttons(btns) : btns}
                {typeof right == 'function' ? right() : right}
                <div className={Style.name}>{localStorage.name}</div>
                <Button type='dashed' onClick={editPwd} icon={<i className="ri-lock-line"></i>}></Button>
                <Button type='dashed' danger onClick={signOut} icon={<PoweroffOutlined />}></Button>
              </Space>
            </div>
          </header>
        )}
        {/* <div className={Style.content}>{children}</div> */}
        <div className={Style.content}>{children}</div>
        {
          (Array.isArray(foot) || foot) && <footer className={Style.footer}>
            <div className={Style.footCnt}>
              {
                Array.isArray(foot) ? <FootBtns data={foot} /> : foot
              }
            </div>
          </footer>
        }
      </Spin>
    </div>
  )
}
