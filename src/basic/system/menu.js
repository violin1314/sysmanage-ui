import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { Breadcrumb, Row, Col, Table, Form, Input, Button, Modal, message, Icon, TreeSelect, Select } from 'antd';
import http from '@/utils/http'

class SysMenu extends Component {
    constructor(props){
        super(props)
        this.state = {
            listLoading: false,

            listObj: {},
            currentPage: 1,
            pageSize: 10,
            treeData: [],

            visible: false,
            modalTitle: '',
            editItem: {},
            sorts: []
        }
    }
    componentDidMount(){
        this.getList(1)
        this.getMenuList()

        let array = []
        for(let i = 0; i < 10; i ++){
            array.push(i + 1)
        }
        this.setState({
            sorts: array
        })
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>菜单管理</Breadcrumb.Item>
                </Breadcrumb>
                <Row className="form-search">
                    <Col>
                        <Button type="primary" onClick={ this.create }>
                            <Icon type="plus" /> 新增菜单
                        </Button>
                    </Col>
                </Row>
                { this.renderTable() }
                { this.renderModal() }
            </div>
        )
    }
    // 渲染数据表格
    renderTable(){
        // 定义列头和对应的数据Key值
        const coulmns = [
            { title: '菜单名称', dataIndex: 'menuName' },
            { title: '菜单地址 ', dataIndex: 'menuUrl' },
            { title: '操作', width: 150, align: 'center',
                render: (text, record) => (
                    <div className="list-actions">
                        <span onClick={this.edit.bind(this, record)}>修改</span>
                        <span onClick={this.delete.bind(this, record.id)}>删除</span>
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
                    <Form.Item label="父菜单">
                        {getFieldDecorator('parentId', {
                            initialValue: this.state.editItem.parentId,
                            rules: [{ required: true, message: '请选择父菜单' }],
                        })(
                            <TreeSelect
                                placeholder="请选择父菜单"
                                treeData={this.state.treeData}
                                treeDataSimpleMode={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="菜单名称">
                        {getFieldDecorator('menuName', {
                            initialValue: this.state.editItem.menuName,
                            rules: [{ required: true, message: '请输入菜单名称' }],
                        })(
                            <Input placeholder="请输入菜单名称" />
                        )}
                    </Form.Item>
                    <Form.Item label="菜单地址">
                        {getFieldDecorator('menuUrl', {
                            initialValue: this.state.editItem.menuUrl
                        })(
                            <Input placeholder="请输入菜单地址" />
                        )}
                    </Form.Item>
                    <Form.Item label="菜单Icon">
                        {getFieldDecorator('icon', {
                            initialValue: this.state.editItem.icon
                        })(
                            <Input placeholder="请输入菜单Icon" />
                        )}
                    </Form.Item>
                    <Form.Item label="显示顺序">
                        {getFieldDecorator('sort', {
                            initialValue: this.state.editItem.sort
                        })(
                            <Select placeholder="请选择显示顺序">
                                {this.state.sorts.map(item => (
                                    <Select.Option key={item} value={item}>{item}</Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    getMenuList = () => {
        http.post('/api/console/menu/getMenuList').then(res => {
            let treeData = [{id: '-1', title: '根菜单', value: '-1'}]
            res.forEach(item => {
                let t = {
                    id: item.id,
                    pId: item.parentId,
                    title: item.menuName,
                    value: item.id
                }
                treeData.push(t)
            })
            this.setState({
                treeData: treeData
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
        http.post('/api/console/menu/getMenuByCondition', data).then(res => {
            this.setState({
                listLoading: false,
                listObj: res
            })
        })
    }

    create = () => {
        this.props.form.resetFields()
        let trees = this.state.treeData.slice()
        trees.forEach((menu, index) => {
            menu.disabled = false
        })
        this.setState({
            visible: true,
            modalTitle: '新增菜单',
            editItem: {},
            treeData: trees
        })
    }
    edit = (item) => {
        this.props.form.resetFields()
        let editItem = Object.assign({}, item)
        // 设置菜单本身不可选为父级
        let trees = this.state.treeData.slice()
        trees.forEach((menu, index) => {
            if(item.id === menu.id){
                menu.disabled = true
            }else{
                menu.disabled = false
            }
        })
        this.setState({
            visible: true,
            modalTitle: '修改菜单',
            editItem: editItem,
            treeData: trees
        })
    }
    delete = (id) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认要删除？',
            onOk: () => {
                http.post('/api/console/menu/deleteMenu', {id: id}).then((res) => {
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
                let data = {}
                if(this.state.editItem.id){
                    url = '/api/console/menu/updateMenu'
                    data = Object.assign({}, this.state.editItem)
                    data['parentId'] = values.parentId
                    data['menuName'] = values.menuName
                    data['menuUrl'] = values.menuUrl
                    data['icon'] = values.icon
                    data['sort'] = values.sort
                    current = this.state.currentPage
                }else{
                    url = '/api/console/menu/addMenu'
                    data = values
                }

                http.post(url, data, { isLoading: true }).then(res => {
                    message.success(this.state.modalTitle + '成功！')
                    this.getList(current)
                    this.setState({
                        visible: false,
                        editItem: {}
                    })
                    this.props.form.resetFields()
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
}

SysMenu = Form.create()(SysMenu)
export default SysMenu;
