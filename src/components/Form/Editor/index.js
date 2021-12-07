/*
 * PageName: 富文本编辑器
 * Description:
 */
import { useEffect, useState } from 'react'
import Wangeditor from "wangeditor"

let editor = ''
export default function (props) {
    let { onChange, value } = props

    // useEffect(() => {
    //     let editor = new Wangeditor("#div1")
    //     editor.create()
    //     // 配置 onchange 回调函数
    //     editor.config.onchange = function (newHtml) {
    //         onChange(newHtml)
    //     }
    //     editor.txt.html(value)
    // }, [])

    useEffect(() => {
        if (editor) {
            editor?.destroy()
            editor = ''
        }
        editor = new Wangeditor("#div1")
        editor.create()
        // 配置 onchange 回调函数
        editor.config.onchange = function (newHtml) {
            onChange(newHtml)
        }
        editor.txt.html(value)
    }, [])

    return (
        <div>
            <div id='div1'></div>
        </div>
    )
}

