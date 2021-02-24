import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Row, Col, Form, Input, Button, Modal, message, Icon, Checkbox, Select } from 'antd';
import http from '@/utils/http'

class SysUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listLoading: false,

            listObj: {},
            currentPage: 1,
            pageSize: 10,
            visible: false,
            modalTitle: '',
            editItem: {},
            tenants: [],
            orgList: [], // 机构列表
            loading: false,

            isConfig: false,
            configId: '',
            roleList: [],
            checkedRoles: [],
            indeterminate: false,
            checkAll: false,
            checkedList: [],

            isConfigType: false,
            typeUserCode: '',
            typeList: [],
            typeChecked: [],
            indeterminateType: false,
            checkTypeAll: false
        }
    }
   
    componentDidMount() {
        this.getTenants()
        this.getList(1)
    }
    render() {
        return (
            <div  className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <Row className="form-search">
                    <Col>
                        <Button type="primary" onClick={this.create}>
                            <Icon type="plus" /> 新增用户
                        </Button>
                    </Col>
                </Row>
                { this.renderTable() }
                { this.renderModal() }
                { this.renderConfigModal() }
                { this.renderTypeModal() }
            </div>
        )
    }
    // 渲染数据表格
    renderTable() {
        // 定义列头和对应的数据Key值
        const coulmns = [
            { title: '姓名', dataIndex: 'userName' },
            { title: '账号', dataIndex: 'account' },
            { title: '编码', dataIndex: 'userCode' },
            { title: '邮箱', dataIndex: 'mail' },
            { title: '电话 ', dataIndex: 'telephone' },
            { title: '机构 ', dataIndex: 'orgName' },
            {
                title: '操作', key: 'action', align: 'center', width: 220,
                render: (text, record) => (
                    <div className="list-actions">
                        <span onClick={this.edit.bind(this, record)}>修改</span>
                        <span onClick={this.delete.bind(this, record.id)}>删除</span>
                        <span onClick={this.config.bind(this, record.id)}>配置角色</span>
                        <span onClick={this.configType.bind(this, record.userCode)}>险种类型</span>
                    </div>
                )
            }
        ]
        let pagination = {
            total: this.state.listObj.totalElements,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: (current) => {
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
        return (
            <Table bordered className="list-table" {...props} />
        )
    }
    renderModal = () => {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        const tenantOpts = this.state.tenants.map(item => 
            <Select.Option key={item.tenantCode} value={item.tenantCode}>{item.tenantName}</Select.Option>
        )
        const orgOpts = this.state.orgList.map(item =>
            <Select.Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Select.Option>
        );
        return (
            <Modal
                className="modal-detail"
                width="600px"
                centered
                title={this.state.modalTitle}
                visible={this.state.visible}
                onOk={this.queryForm}
                onCancel={this.cancel}
            >
                <div className="modal-detail-content" style={{ height: 450 }}>   
                    <Form onSubmit={this.queryForm} {...formItemLayout}>
                        {/* 防止自动填充 */}
                        <div style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
                            <Input name="username" />
                            <Input name="password" type="password" />
                        </div>

                        <Form.Item label="姓名">
                            {getFieldDecorator('userName', {
                                initialValue: this.state.editItem.userName,
                                rules: [{ required: true, message: '请输入姓名' }],
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </Form.Item>
                        <Form.Item label="账号">
                            {getFieldDecorator('account', {
                                initialValue: this.state.editItem.account,
                                rules: [{ required: true, message: '请输入账号' }],
                            })(
                                <Input placeholder="请输入账号" />
                            )}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('pwd', {
                                initialValue: this.state.editItem.pwd,
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input type="password" placeholder="请输入密码" />
                            )}
                        </Form.Item>
                        <Form.Item label="编码">
                            {getFieldDecorator('userCode', {
                                initialValue: this.state.editItem.userCode,
                                rules: [{ required: true, message: '请输入编码' }]
                            })(
                                <Input  placeholder="请输入编码"  />
                            )}
                        </Form.Item>
                        <Form.Item label="电话">
                            {getFieldDecorator('telephone', {
                                initialValue: this.state.editItem.telephone,
                                rules: [{ required: true, message: '请输入电话' }],
                            })(
                                <Input placeholder="请输入电话" maxLength={11} />
                            )}
                        </Form.Item>
                        <Form.Item label="邮箱">
                            {getFieldDecorator('mail', {
                                initialValue: this.state.editItem.mail,
                                rules: [{ required: true, message: '请输入邮箱' }],
                            })(
                                <Input placeholder="请输入邮箱" />
                            )}
                        </Form.Item>
                        <Form.Item label="租户">
                            {getFieldDecorator('tenantCode', {
                                initialValue: this.state.editItem.tenantCode,
                                rules: [{ required: true, message: '请选择租户' }],
                            })(
                                <Select placeholder="请选择租户" onChange={ this.changeTenant }>
                                    { tenantOpts }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="机构">
                            {getFieldDecorator('orgCode', {
                                initialValue: this.state.editItem.orgCode,
                                rules: [{ required: true, message: '请选择机构' }],
                            })(
                                <Select placeholder="请选择机构">
                                    { orgOpts }
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        )
    }
    renderConfigModal() {
        const roleOpts = this.state.roleList.map(item =>
            <Col key={item.id} span={8} style={{ padding: '5px 0' }}>
                <Checkbox value={item.id}>{item.roleName}</Checkbox>
            </Col>
        )
        return (
            <Modal
                title="配置角色"
                width="700px"
                visible={this.state.isConfig}
                onCancel={this.cancelConfig}
                onOk={this.queryConfig}
            >
                <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '5px', marginBottom: '10px' }}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        选择全部
                    </Checkbox>
                </div>
                <Checkbox.Group style={{ width: '100%' }} value={this.state.checkedRoles} onChange={this.checkboxChange}>
                    <Row>
                        {roleOpts}
                    </Row>
                </Checkbox.Group>
            </Modal>
        )
    }
    getTenants = () => {
        http.post('/api/console/tenant/queryByCondition').then(res => {
            this.setState({
                tenants: res
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
        http.post('/api/console/user/getUserByCondition', data).then(res => {
            this.setState({
                listLoading: false,
                listObj: res
            })
        })
    }
    changeTenant = value => {
        this.props.form.setFieldsValue({
            orgCode: ''
        })
        this.getOrgList(value)
    }
    getOrgList = id => {
        http.post('/api/console/orginazation/find', { tenantCode: id }).then(res => {
            this.setState({
                orgList: res
            })
        })
    }
    create = () => {
        this.props.form.resetFields()
        this.setState({
            visible: true,
            modalTitle: '新增用户',
            editItem: {}
        })
    }
    edit = (item) => {
        this.props.form.resetFields()
        let editItem = Object.assign({}, item)
        this.setState({
            visible: true,
            modalTitle: '修改用户',
            editItem: editItem
        })
        this.getOrgList(editItem.tenantCode)
    }
    delete = (id) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认要删除？',
            onOk: () => {
                http.post('/api/console/user/deleteUser', { id: id }).then((res) => {
                    message.success('删除成功！')
                    this.getList(1)
                })
            }
        })
    }
    queryForm = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let url = ''
                let current = 1
                let data = {}
                if (this.state.editItem.id) {
                    url = '/api/console/user/updateUser'
                    data = Object.assign({}, this.state.editItem)
                    data['userName'] = values.userName
                    data['pwd'] = values.pwd
                    data['account'] = values.account
                    data['userCode'] = values.userCode
                    data['telephone'] = values.telephone
                    data['mail'] = values.mail
                    data['orgCode'] = values.orgCode
                    
                    current = this.state.currentPage
                } else {
                    url = '/api/console/user/addUser'
                    data = values
                }
                this.setState({
                    loading: true
                })
                http.post(url, data, { isLoading: true }).then(res => {
                    message.success(this.state.modalTitle + '成功！')
                    this.getList(current)
                    this.setState({
                        loading: false,
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
    // 配置角色
    config = (id) => {
        this.setState({
            isConfig: true,
            configId: id
        })
        this.getUserRole(id)
        this.getRoleList()
    }
    getRoleList = () => {
        if (this.state.roleList.length > 0) {
            return
        }
        http.post('/api/console/role/getRoleList').then(res => {
            this.setState({
                roleList: res
            })
        })
    }
    getUserRole = (id) => {
        http.post('/api/console/user/getUserRoleByUserId', { id: id }).then(res => {
            let roleIds = []
            res.forEach(item => {
                roleIds.push(item.roleId)
            })
            this.setState({
                checkedRoles: roleIds
            })
        })
    }
    checkboxChange = (checkedList) => {
        let roleList = this.state.roleList
        this.setState({
            checkedRoles: checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < roleList.length),
            checkAll: checkedList.length === roleList.length,
        });
    }
    onCheckAllChange = (e) => {
        let roleIdList = []
        this.state.roleList.forEach(item => {
            roleIdList.push(item.id)
        })
        this.setState({
            checkedRoles: e.target.checked ? roleIdList : [],
            indeterminate: false,
            checkAll: e.target.checked,
        })
    }
    cancelConfig = () => {
        this.setState({
            isConfig: false,
            checkedRoles: []
        })
    }
    queryConfig = () => {
        let data = {
            id: this.state.configId,
            roleIds: this.state.checkedRoles
        }
        http.post('/api/console/user/updateUserRoleByUserId', data).then(res => {
            message.success('配置角色成功！')
            this.setState({
                isConfig: false
            })
        })
    }

    // 配置险种类型
    renderTypeModal() {
        const opts = this.state.typeList.map(item =>
            <Col key={item.code} span={8} style={{ padding: '5px 0' }}>
                <Checkbox value={item.code}>{item.name}</Checkbox>
            </Col>
        )
        return (
            <Modal
                title="配置险种类型"
                width="700px"
                visible={ this.state.isConfigType }
                onCancel={ this.cancelConfigType }
                onOk={ this.queryConfigType }
            >
                <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '5px', marginBottom: '10px' }}>
                    <Checkbox
                        indeterminate={this.state.indeterminateType}
                        onChange={this.typeCheckAllChange}
                        checked={this.state.checkTypeAll}
                    >
                        选择全部
                    </Checkbox>
                </div>
                <Checkbox.Group style={{ width: '100%' }} value={this.state.typeChecked} onChange={this.typeChange}>
                    <Row>
                        { opts }
                    </Row>
                </Checkbox.Group>
            </Modal>
        )
    }
    configType = userCode => {
        this.setState({
            isConfigType: true,
            typeUserCode: userCode,
            typeChecked: [],
            typeList: [],
            checkTypeAll: false,
            indeterminateType: false
        }, () => {
            this.getInsuranceType(userCode)
        })
    }
    getInsuranceType = userCode => {
        http.post('/api/console/user/getInsuranceCode', { userCode: userCode }, { isLoading: true }).then(res => {
            let typeList = []
            let typeChecked = []
            res.forEach(item => {
                typeList.push({ code: item.insuranceCode, name: item.insuranceName })
                if(item.checked === 1){
                    typeChecked.push(item.insuranceCode)
                }
            })
            this.setState({
                typeList,
                typeChecked,
                checkTypeAll: typeList.length && typeList.length === typeChecked.length
            })
        })
    }
    cancelConfigType = () => {
        this.setState({
            isConfigType: false
        })
    }
    typeChange = checkedList => {
        let typeList = this.state.typeList
        this.setState({
            typeChecked: checkedList,
            indeterminateType: !!checkedList.length && (checkedList.length < typeList.length),
            checkTypeAll: checkedList.length === typeList.length,
        });
    }
    typeCheckAllChange = e => {
        let typeChecked = []
        this.state.typeList.forEach(item => {
            typeChecked.push(item.code)
        })
        this.setState({
            typeChecked: e.target.checked ? typeChecked : [],
            indeterminateType: false,
            checkTypeAll: e.target.checked,
        })
    }
    queryConfigType = () => {
        let userInsuranceRelation = []
        this.state.typeChecked.forEach(item => {
            userInsuranceRelation.push({ insuranceCode: item })
        })
        let data = {
            userCode: this.state.typeUserCode,
            userInsuranceRelation
        }
        http.post('/api/console/user/updateInsuranceCode', data, { isLoading: true }).then(res => {
            message.success('配置险种类型成功！')
            this.setState({
                isConfigType: false
            })
        })
    }
}

SysUser = Form.create()(SysUser)
export default SysUser;
