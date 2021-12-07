/*
 * PageName: 页面
 * Description:
 */
import * as React from 'react';
import { Space, Button, Spin } from 'antd';
import Style from './style.less';
import { history } from 'umi'
import { PoweroffOutlined } from '@ant-design/icons';
import FootBtns from './footBtns'
import { FormModal } from '../Form'

export default function (props) {
  const formRef = React.useRef()

  let { children, title, right = [], btns = [], foot = null, loading = false, bgColor } = props;

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
            );
          }).filter(Boolean)
        }
      </>
    );
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

      <FormModal
        refs={formRef}
        form={{
          items: [[
            {
              type: 'Input',
              label: '旧密码',
              placeholder: '请输入旧密码',
              name: 'oldPassword',
              rules: [{ required: true, message: '请输入旧密码' }],
              // extend: () => {
              //     return (
              //         <div>111</div>
              //     )
              // }
            }, {
              type: 'Input',
              label: '新密码',
              placeholder: '请输入新密码',
              name: 'newPassword',
              rules: [{
                validator(rule, value) {
                  let reny = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/,
                    bixu = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]$/
                  let gz = JSON.parse(localStorage.configGetPassword || '{}')
                  if (!value) {
                    return Promise.reject(new Error('请输入新密码'));
                  } else if (value.length > gz.max) {
                    return Promise.reject(new Error('密码长度必须小于' + gz.max));
                  } else if (value.length < gz.min) {
                    return Promise.reject(new Error('密码长度必须大于' + gz.min));
                  } else if (gz.complexity == 1 && !reny.test(value)) {
                    return Promise.reject(new Error('数字、字母、特殊字符任意两个的组合'));
                  } else if (gz.complexity == 2 && !bixu.test(value)) {
                    return Promise.reject(new Error('数字、字母、特殊字符的组合'));
                  }
                  return Promise.resolve();
                }
              }]
            }, {
              type: 'Input',
              label: '再次输入',
              placeholder: '请再次输入新密码',
              name: 'newPassword2',
              dependencies: ['newPassword'],
              rules: [{
                required: true, message: '请再次输入新密码',
              }, ({ getFieldValue, setFields }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入密码不一致'));
                },
              })]
            },
          ]]
        }} />
    </div>
  )
}
