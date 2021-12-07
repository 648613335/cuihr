# cuihr

#### 介绍
私有库自定义组件，在antd基础上做的迭代

#### 使用说明

package.json 文件里面引用：
`"cuihr": "git+https://gitee.com/wesf/cuihr.git"`

#### 组件迭代编写注意点

* 页面import

> > `import { Form as Forms } from 'antd';`
> > 私有组件引用不能用 `as` 重命名，会报错

* 第二项

> > `import { Form as Forms } from '@/antd';`
> > 私有组件里面引用路径不能用 `@/`，会报错
