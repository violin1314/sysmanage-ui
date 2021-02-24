import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { Breadcrumb, Row, Col, Table, Form, Input, Button, Modal, message, Icon, Tree, InputNumber } from 'antd';
import http from '@/utils/http'

class SysRole extends Component {
    constructor(props){
        super(props)
        this.state = {
            listLoading: false,

            listObj: {},
            currentPage: 1,
            pageSize: 10,
            
            visible: false,
            modalTitle: '',
            editItem: {},

            isConfig: false,
            configId: '',
            menuTree: [],
            checkedMenus: []
        }
    }
    componentDidMount(){
        this.getList(1)
        this.getMenuList()
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                </Breadcrumb>
                <Row className="form-search">
                    <Col>
                        <Button type="primary" onClick={ this.create }>
                            <Icon type="plus" /> 新增角色
                        </Button>
                    </Col>
                </Row>
                { this.renderTable() }
                { this.renderModal() }
                <Modal
                    title="配置菜单"
                    visible={this.state.isConfig}
                    onOk={this.queryConfig}
                    onCancel={this.cancelConfig}
                >
                    <Tree
                        checkable
                        checkedKeys={this.state.checkedMenus}
                        defaultCheckedKeys={this.state.checkedMenus}
                        onCheck={this.onCheck}
                    >
                        { this.renderNodes(this.state.menuTree) }
                    </Tree>
                </Modal>
            </div>
        )
    }
    renderNodes(menus){
        const { TreeNode } = Tree;
        return (
            menus.map(menu => {
                if(menu.items){
                    return(
                        <TreeNode key={ menu.id } title={ menu.menuName }>
                            { this.renderNodes(menu.items) }
                        </TreeNode>
                    )
                }else{
                    return (
                        <TreeNode  key={ menu.id } title={ menu.menuName } />
                    )
                }
            })
        )
    }
    // 渲染数据表格
    renderTable(){
        // 定义列头和对应的数据Key值
        const coulmns = [
            { title: '角色名称', dataIndex: 'roleName', align: 'center' },
            { title: '操作', align: 'center', width: 300,
                render: (text, record) => (
                    <div className="list-actions">
                        <span onClick={this.edit.bind(this, record)}>修改</span>
                        <span onClick={this.delete.bind(this, record.id)}>删除</span>
                        <span onClick={this.config.bind(this, record.id)}>配置菜单</span>
                    </div>
                )
            }
        ]
        let pagination = {
            total: this.state.listObj.totalElements,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: (current)=> {
                this.getList(current)
            }
        }
        // 列表参数集合
        const props = {
            rowKey: 'id',
            size: 'middle',
            columns: coulmns,
            dataSource: this.state.listObj.content,
            loading: this.state.listLoading,
            pagination: pagination
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    renderModal = () => {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        return(
            <Modal
                title={this.state.modalTitle}
                visible={this.state.visible}
                onOk={this.queryForm}
                onCancel={this.cancel}
            >
                <Form onSubmit={this.queryForm} {...formItemLayout}>
                    <Form.Item label="角色名称">
                        {getFieldDecorator('roleName', {
                            initialValue: this.state.editItem.roleName,
                            rules: [{ required: true, message: '请输入角色名称' }],
                        })(
                            <Input placeholder="请输入角色名称" />
                        )}
                    </Form.Item>
                    <Form.Item label="审核上限金额">
                        {getFieldDecorator('checkUpMoney', {
                            initialValue: this.state.editItem.checkUpMoney
                        })(
                            <InputNumber placeholder="请输入审核上限金额" style={{ width: '100%' }} />
                        )}
                    </Form.Item>
                    <Form.Item label="审核下限金额">
                        {getFieldDecorator('checkDownMoney', {
                            initialValue: this.state.editItem.checkDownMoney
                        })(
                            <InputNumber placeholder="请输入审核下限金额" style={{ width: '100%' }} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
    getMenuList = () => {
        http.post('/api/console/menu/getMenuList').then(res => {
            let menuTree = this.loopTreeData(res, '-1')
            this.setState({
                menuTree: menuTree
            })
        })
    }
    // 获取列表数据
    getList = (currentPage) => {
        this.setState({
            listLoading: true,
            currentPage: currentPage
        });
        let data = {
            currentPage: currentPage,
            pageSize: this.state.pageSize
        }
        http.post('/api/console/role/getRoleByCondition', data).then(res => {
            this.setState({
                listLoading: false,
                listObj: res
            })
        })
    }
    create = () => {
        this.props.form.resetFields()
        this.setState({
            visible: true,
            modalTitle: '新增角色',
            editItem: {}
        })
    }
    edit = (item) => {
        this.props.form.resetFields()
        let editItem = Object.assign({}, item)
        this.setState({
            visible: true,
            modalTitle: '修改角色',
            editItem: editItem
        })
    }
    delete = (id) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认要删除？',
            onOk: () => {
                http.post('/api/console/role/deleteRole', { id: id }).then((res) => {
                    message.success('删除成功！')
                    this.getList(1)
                })
            }
        })
    }
    queryForm = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let url = ''
                let current = 1
                let data = values
                
                if(this.state.editItem.id){
                    url = '/api/console/role/updateRole'
                    data['id'] = this.state.editItem.id
                    current = this.state.currentPage
                }else{
                    url = '/api/console/role/addRole'
                }

                http.post(url, data, { isLoading: true }).then(res => {
                    message.success(this.state.modalTitle + '成功！')
                    this.getList(current)
                    this.setState({
                        visible: false
                    })
                })
            }
        })
    }
    cancel = () => {
        this.props.form.resetFields()
        this.setState({
            visible: false
        })
    }
    
    config = (id) => {
        this.setState({
            isConfig: true,
            configId: id
        })
        this.getRoleMenu(id)
    }
    getRoleMenu = (id) => {
        http.post('/api/console/role/getRoleMenuByRoleId', {id: id}, { isLoading: true }).then(res => {
            let menuIds = []
            res.forEach(item => {
                menuIds.push(item.menuId)
            })
            this.setState({
                checkedMenus: menuIds
            })
        })
    }
    loopTreeData(data, pid) {
        let result = [], temp;
        for(let i = 0; i < data.length; i++){
            if(data[i].parentId === pid){
                let obj = {
                    menuName: data[i].menuName,
                    id: data[i].id
                }
                temp = this.loopTreeData(data, data[i].id);
                if (temp.length > 0) {
                    obj.items = temp;
                }
                result.push(obj);
            }
        }
        return result;
    }
    onCheck = (values, e) => {
        this.setState({
            checkedMenus: values,
            halfCheckedKeys: e.halfCheckedKeys  // 半选中状态的父节点key
        })
    }
    cancelConfig = () => {
        this.setState({
            isConfig: false
        })
    }
    queryConfig = () => {
        let checks = []
        checks = this.state.checkedMenus
        
        let data = {
            id: this.state.configId,
            menuIds: checks
        }
        http.post('/api/console/role/updateRoleMenuByRoleId', data, { isLoading: true }).then(res => {
            message.success('配置菜单成功！')
            this.setState({
                isConfig: false
            })
        })
    }
}

SysRole = Form.create()(SysRole)
export default SysRole;
