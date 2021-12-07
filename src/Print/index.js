/*
 * PageName: 
 * Autor: 崔皓然
 * Description: 
 */
import React from 'react'
import { Button } from 'antd'

export default function (props) {

    let { button = {}, before, after,
        iframeId = 'iframeId',
        noPagination = false,
        areaId = 'printDiv',// 打印区域id
        areaClass = 'areaClass',// 打印区域样式class，改样式用这个当父级！！！

        // 配合areaClass，修改打印区域样式
        // 案例 canteen/eims/purchase/detail
        areaStyle = '',
    } = props

    // 打印默认样式（如果影响，就在areaStyle里面写样式抵消！！）
    const style = `
     <style>
     .ant-card-head-title{font-weight: bold;margin-bottom:10px}
     .areaClass table{width: 100%;border-collapse: collapse;}
     .areaClass table td,.areaClass table th{border:1px solid #000;text-align:center}
     ${areaStyle}
     </style>
     `

    /**
     * FunctionName: 点击打印
     * Author: 崔皓然
     * Description: 
     */
    function print() {
        before && before()
        if (document.getElementById(iframeId)) {
            document.getElementById(iframeId).remove()
        }
        //获取打印区域
        const printDiv = document.getElementById(areaId)
        const iframe = document.createElement('IFRAME')
        let doc = null
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;');
        iframe.setAttribute('id', iframeId)
        document.body.appendChild(iframe)
        doc = iframe.contentWindow.document
        // 打印时去掉页眉页脚
        doc.write('<style media="print">@page {size: auto;  margin: 0mm; }</style>')

        doc.write(style)// 修改打印样式
        doc.write(printDiv.innerHTML)
        doc.body.setAttribute('class', areaClass)
        // 去除分页
        if (!noPagination) {
            let pagin = doc.getElementsByClassName('ant-pagination')
            if (pagin.length > 0) {
                pagin[0].innerHTML = ''
            }
        }
        doc.close();
        // 获取iframe的焦点，从iframe开始打印
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            //打印完删除iframe
            document.body.removeChild(iframe)
        }
        after && after()
    }

    return (<Button type='primary' onClick={print} {...button}>打印</Button>)
}
