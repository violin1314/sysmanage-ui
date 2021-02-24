import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { Breadcrumb, Row, Col, Table, Form, Input, Button, Modal, message, Icon } from 'antd';
import http from '@/utils/http'
import FormSearch from './FormSearch'
import icon1 from "@/project-rs/assets/images/icon/icon-bdxx.png";

class SysMenu extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchData: {},
            listLoading: false,

            listObj: {},
            currentPage: 1,
            pageSize: 10,

            visible: false,
            modalTitle: '',
            editItem: {}
        }
    }
    componentDidMount(){
        this.getList(1)
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>医院管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon1 } alt=""/>
                            <span>医院信息</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <Row type="flex" justify="space-between" align="middle" className="form-search">
                            <Col>
                                <FormSearch query={ this.querySearch } />
                            </Col>
                            <Col>
                                <Button type="primary" onClick={ this.create }>
                                    <Icon type="plus" /> 新增
                                </Button>
                            </Col>
                        </Row>
                        { this.renderTable() }
                    </div>
                </div>
                { this.renderModal() }
            </div>
        )
    }
    querySearch = v => {
        this.setState({
            searchData: v
        }, () => {
            this.getList(1)
        })
    }
    renderTable(){
        // 定义列头和对应的数据Key值
        const columns = [
            { title: '医院名称', dataIndex: 'hospitalName' },
            { title: '医院编码 ', dataIndex: 'hospitalCode' },
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
            columns,
            dataSource: this.state.listObj.content,
            loading: this.state.listLoading,
            pagination
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
                    <Form.Item label="医院名称">
                        {getFieldDecorator('hospitalName', {
                            initialValue: this.state.editItem.hospitalName,
                            rules: [{ required: true, message: '请输入医院名称' }],
                        })(
                            <Input placeholder="请输入医院名称" />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    getList = (currentPage) => {
        this.setState({
            listLoading: true,
            currentPage: currentPage
        });
        let data = this.state.searchData;
        data.currentPage = currentPage;
        data.pageSize = this.state.pageSize

        http.post('/rs/api/claim/hospitalInfo/findHospitalInfoByContion', data).then(res => {
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
            modalTitle: '新增',
            editItem: {}
        })
    }
    edit = (item) => {
        this.props.form.resetFields()
        let editItem = Object.assign({}, item)
        this.setState({
            visible: true,
            modalTitle: '修改',
            editItem: editItem
        })
    }
    delete = (id) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认要删除？',
            onOk: () => {
                http.post('/rs/api/claim/hospitalInfo/deleteHospitalInfo', {id: id}, {isLoading: true}).then((res) => {
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
                    url = '/rs/api/claim/hospitalInfo/updateHospitalInfo'
                    data['id'] = this.state.editItem.id
                    current = this.state.currentPage
                }else{
                    url = '/rs/api/claim/hospitalInfo/saveHospitalInfo'
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
