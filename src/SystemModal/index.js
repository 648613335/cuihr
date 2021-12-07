/*
 * PageName: 权限选择弹窗
 * Description:
 */
import { useState, useEffect } from 'react'
import { Modal, Input, Tree, Spin } from 'antd'
import { cloneDeep, reject } from 'lodash';


const { Search } = Input;

export default function (props) {
    let {
        title = '权限设置',
        onOk,
        onCancel = () => { },
        visible,
        treeData,
        allList,
        defaultExpandedKeys,
        checkable = true,
        showIcon = false,
        loading = false,
        confirmLoading = false
    } = props

    console.log(props);


    const [searchValue, setSearchValue] = useState('')
    const [checkedKeys, setCheckedKeys] = useState([])
    const [checkedNodes, setCheckedNodes] = useState([])
    const [expandedKeys, setExpandedKeys] = useState([])
    const [halfCheckedKeys, setHalfCheckedKeys] = useState([])
    const [autoExpandParent, setAutoExpandParent] = useState(true);


    useEffect(() => {
        setCheckedKeys(props.checkedKeys);
        setCheckedNodes(props.checkedNodes || []);
        setHalfCheckedKeys(props.halfCheckedKeys || []);
        setExpandedKeys(props.defaultExpandedKeys || []);
    }, [])

    // function generateData(_level, _preKey, _tns) {
    //     const preKey = _preKey || '0';
    //     const tns = _tns || gData;

    //     const children = [];
    //     for (let i = 0; i < x; i++) {
    //         const key = `${preKey}-${i}`;
    //         tns.push({ title: key, key });
    //         if (i < y) {
    //             children.push(key);
    //         }
    //     }
    //     if (_level < 0) {
    //         return tns;
    //     }
    //     const level = _level - 1;
    //     children.forEach((key, index) => {
    //         tns[index].children = [];
    //         return generateData(level, key, tns[index].children);
    //     });
    // };
    // generateData(z);

    function getParentKey(key, tree) {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    function onExpand(expandedKeys, e) {
        setExpandedKeys(expandedKeys)
        setAutoExpandParent(false);
    };

    function onChange(e) {
        const { value } = e.target;
        const expandedKeys = allList.map(item => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.key, allList);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        setSearchValue(value)
        if (value) {
            setExpandedKeys(expandedKeys)
        } else {
            setExpandedKeys([])
        }
        setAutoExpandParent(true);
    };

    function loop(data) {
        return data.map(item => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            if (item.children) {
                return { ...item, children: loop(item.children) };
            }

            return {
                ...item,
            };
        });
    }


    /**
     * FunctionName: 权限设置
     * Author: 崔皓然
     * Description: 
     */
    function handleCheck(checkedKeys, e) {
        // onCheck(checkedKeys, e)
        setCheckedKeys(checkedKeys)
        setHalfCheckedKeys(e.halfCheckedKeys);
        setCheckedNodes(e.checkedNodes)
    }

    /**
     * FunctionName: 关闭
     * Author: 崔皓然
     * Description: 
     */
    function handleCancel() {
        setExpandedKeys([])
        onCancel()
    }

    function handleOk() {
        props?.onOk(checkedKeys, halfCheckedKeys, checkedNodes)
    }

    console.log(11)
    return (
        <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true} visible={props.visible}>
            <Search style={{ marginBottom: 8 }} placeholder="" onChange={onChange} />
            <Tree
                checkable={checkable}
                showIcon={showIcon}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                checkedKeys={checkedKeys}
                treeData={loop(treeData)}
                onCheck={handleCheck}
                height={500}
            />
        </Modal>
    )
}
