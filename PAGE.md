``` javascript
<!--
 * PageName: 简单案例
 * Branch: 0629
 * Autor: 崔皓然
 * Description: 
-->
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, history } from 'umi'
import { Modal, Button, Popconfirm, message } from 'antd'
import { transport } from '@/utils/statusList'
import { useOptions } from '@/utils/hooks'
import { Page, Table, TableBtns, Search, Export, FormModal } from 'cuihr'

let { company } = transport

export default function (props) {
  const dispatch = useDispatch()
  const [dataSource, setDataSource] = useState([]) // 列表数据
  const [payload, setPayload] = useState({ pageNumber: 1 })
  const [pagination, setPagination] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const loading = useSelector((state) => state.loading)
  const common = useSelector((state) => state.common)
  const refs = useRef()

  const editItems = [
    [
      {
        type: 'Input',
        label: '外协名称',
        placeholder: '请输入',
        name: 'name',
        rules: [{ required: true, message: '请输入外协名称' }]
      },
      {
        type: 'Select',
        label: '类型',
        placeholder: '请选择',
        name: 'type',
        options: company.type_list,
        initialValue: 1,
        rules: [{ required: true, message: '请选择类型', }]
      },
      {
        type: 'Select',
        label: '关联系统账号',
        showSearch: true,
        optionFilterProp: 'label',
        isSelect: { value: '0', label: '无' },
        loading: loading.effects['common/user'],
        placeholder: '请输入',
        initialValue: '0',
        name: 'userId',
        options: [],
        onChange: (val, options) => {
          refs?.current?.form?.setFieldsValue({
            contactPhone: options?.mobilePhone,
            contactName: options?.name
          })
        },
        rules: [{ required: true, message: '请选择关联系统账号', initialValue: '0' }]
      },
      {
        type: 'Input',
        label: '联系人姓名',
        placeholder: '请输入',
        name: 'contactName',
        rules: [{ required: true, message: '请输入联系人姓名' }]
      },

      {
        type: 'Input',
        label: '联系方式',
        placeholder: '请输入',
        name: 'contactPhone',
        rules: [{ required: true, message: '请输入联系方式', pattern: pattern.mobile }]
      },
      {
        type: 'Select',
        label: '状态',
        name: 'status',
        initialValue: 10,
        options: company.status_list,
        rules: [{ required: true, message: '请选择状态' }]
      },
      {
        type: 'TextArea',
        label: '营业范围',
        placeholder: '请输入',
        name: 'businessScope',
        maxLength: 150,
        showCount: true
      },
      {
        type: 'TextArea',
        label: '备注',
        placeholder: '请输入',
        name: 'remark',
        maxLength: 150,
        showCount: true
      },
    ]
  ]

  useEffect(() => {
    query()
    // 分页，参数有变动就刷新列表
  }, [payload])

  /**
   * FunctionName: 列表查询
   * Description:
   */
  function query() {
    dispatch({
      type: 'company/query',
      api: 'Lcy/Company/CompanyGetPagingList',
      payload
    }).then((result) => {
      if (result?.data) {
        let data = result?.data
        setPagination({
          total: data.total,
        })
        setDataSource(data.list)
      }
    })
  }

  /**
   * FunctionName: 删除
   * Description:
   * param {*} payload
   */
  function del(payload) {
    return dispatch({
      type: 'company/edit',
      api: 'Lcy/Company/CompanyDelete',
      payload,
    })
  }

  /**
   * FunctionName: 批量删除
   * Description:
   */
  function dels() {
    return dispatch({
      type: 'company/edit',
      api: 'Lcy/Company/CompanyDeletes',
      payload: {
        ids: selectedRowKeys
      },
    })
  }


  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys),
  }

  return (
    <Page title="外协管理">
      <Search
        items={[
          {
            type: 'Input',
            label: '查询',
            placeholder: '请输入名称、联系人姓名、联系方式',
            name: 'query'
          }
        ]}
        handleSearch={({ values, form }) => {
          setPayload(values)
        }}
      />
      <Table
        btns={[
          {
            show: isHave({ pid: 3, id: 32 }),
            name: '新建',
            onClick: () => {
              refs.current?.formModal({
                visible: true,
                reset: true,
                modal: {
                  title: '新建',
                  saveFetch: {
                    type: 'company/edit',
                    api: 'Lcy/Company/CompanyAdd',
                  },
                  handleOk: ({ values, form }) => {
                    query()
                    return false
                  },
                  handleCancel: ({ values, form }) => {
                    return false
                  },
                },
              })
            },
          },
          {
            show: isHave({ pid: 3, id: 33 }),
            render() {
              return <Button onClick={() => {
                if (selectedRowKeys.length <= 0) {
                  message.error('请至少选中一条数据')
                  return false
                }
                Modal.confirm({
                  title: '删除确认',
                  content: '你确定要删除此外协吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    return new Promise((resolve, reject) => {
                      dels().then((result) => {
                        if (result?.status == 200) {
                          resolve(true)
                          query()
                        }
                      })
                    })
                  }
                })
              }}>批量删除</Button>
            }
          },
          {
            show: isHave({ pid: 3, id: 34 }),
            render: () => <Export url="Company/ExportData" payload={payload} />
          }
        ]}
        table={{
          loading: loading.effects['company/query'],
          dataSource,
          rowKey: 'id',
          rowSelection,
          columns: [
            {
              title: '名称',
              dataIndex: 'name'
            },
            {
              title: "类型",
              dataIndex: "type",
              render: (text) => company.type_list.filter((item) => item.value == text)[0]?.label
            },
            {
              title: '联系人姓名',
              dataIndex: 'contactName',
            },
            {
              title: '联系方式',
              dataIndex: 'contactPhone',
            },
            {
              title: '营业范围',
              dataIndex: 'businessScope',
            },
            {
              title: '备注',
              dataIndex: 'remark',
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (text) => company.status_list.filter((item) => item.value == text)[0]?.label
            },
            {
              title: '操作',
              dataIndex: 'opt',
              render(text, record, index) {
                return (
                  <TableBtns
                    data={[
                      {
                        show: isHave({ pid: 3, id: 35 }),
                        name: '编辑',
                        onClick: () => {
                          refs.current.formModal({
                            visible: true,
                            reset: true,
                            values: record,
                            modal: {
                              title: '编辑',
                              saveFetch: {
                                type: 'company/edit',
                                api: 'Lcy/Company/CompanyUpdate',
                                payload: { id: record.id },
                              },
                              handleOk: ({ values, form }) => {
                                query()
                                return false
                              },
                              handleCancel: ({ values, form }) => {
                                return false
                              },
                            },
                          })
                        },
                      },
                      {
                        show: isHave({ pid: 3, id: 36 }),
                        name: '删除',
                        onClick: () => {
                          Modal.confirm({
                            title: '删除确认',
                            content: '你确定要删除此外协吗？',
                            okText: '确认',
                            cancelText: '取消',
                            onOk() {
                              return new Promise((resolve, reject) => {
                                del({ id: record.id }).then((result) => {
                                  if (result?.status == 200) {
                                    resolve(true)
                                    query()
                                  }
                                })
                              })
                            }
                          })
                        }
                      }
                    ]}
                  />
                )
              }
            }
          ]
        }}
        pagination={{
          current: payload.pageNumber,
          ...pagination,
          onChange: (page, pageSize) => {
            setPayload({ ...payload, pageNumber: page })
          },
        }}
      />
      <FormModal refs={refs} form={{ items: editItems }} />
    </Page>
  )
}
```