import React, { Component } from 'react'
import { Form, Input, Select, Button, Table, Row, Col, DatePicker, message } from 'antd';
import http from '@/utils/http'
import utils from '@/utils'
import moment from 'moment'
import CaseAddSearch from './CaseAddSearch'

class CaseAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},
            selectedKeys: [],

            relationships: [],
            accidentReasons: []
        }
    }
    componentDidMount(){
        this.setState({
            visible: this.props.visible
        })

        utils.getCodeList(['relationship2', 'accident_reason'], res => {
            this.setState({
                relationships: res[0].value,
                accidentReasons: res[1].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            visible: nextProps.visible
        })
        if(this.props.visible !== nextProps.visible && !nextProps.visible){
            this.setState({
                listObj: {},
                selectedKeys: []
            })
            this.props.form.resetFields()
            if(document.querySelector('.modal-detail-content')){
                document.querySelector('.modal-detail-content').scrollTop = 0
            }
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="card">
                    <div className="card-title">
                        <p className="title">
                            <span>保单信息</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <CaseAddSearch query={ this.querySearch } visible={ this.state.visible } />
                        { this.renderList() }
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">
                        <p className="title">
                            <span>录入报案</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <Form className="query-form" {...formItemLayout} onSubmit={this.searchSubmit} >
                            <Row>
                                <Col span={12}>
                                    <Form.Item label="报案人姓名">
                                        {getFieldDecorator('reporterName', {
                                            rules: [{ required: true, message: '请输入报案人姓名' }]
                                        })(
                                            <Input placeholder="请输入报案人姓名" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="报案人电话">
                                        {getFieldDecorator('reporterPhone', {
                                            rules: [
                                                { required: true, message: '请输入报案人电话' },
                                                { pattern: /^\d{8,12}$/, message: '电话格式不正确' }
                                            ]
                                        })(
                                            <Input placeholder="请输入报案人电话" maxLength="12" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="报案人与被保险人关系">
                                        {getFieldDecorator('applyRelationship', {
                                            rules: [
                                                { required: true, message: '请选择报案人与被保险人关系' }
                                            ]
                                        })(
                                            <Select placeholder="请选择报案人与被保险人关系">
                                            {
                                                this.state.relationships.map((item, index) => (
                                                    <Select.Option id={`applyRelationship${index}`} key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                                ))
                                            }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="出险地点">
                                        {getFieldDecorator('damageAddress', {
                                            rules: [{ required: true, message: '请输入出险地点' }]
                                        })(
                                            <Input placeholder="请输入出险地点" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="出险经过">
                                        {getFieldDecorator('accidentDescribe', {
                                            rules: [{ required: true, message: '请输入出险经过' }]
                                        })(
                                            <Input.TextArea placeholder="请输入出险经过" rows={4} />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="备注">
                                        {getFieldDecorator('remark')(
                                            <Input.TextArea placeholder="请输入备注" rows={4} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="联系人姓名">
                                        {getFieldDecorator('contactName', {
                                            rules: [{ required: true, message: '请输入联系人姓名' }]
                                        })(
                                            <Input placeholder="请输入联系人姓名" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="联系人电话">
                                        {getFieldDecorator('contactTel', {
                                            rules: [
                                                { required: true, message: '请输入联系人电话' },
                                                { pattern: /^\d{8,12}$/, message: '电话格式不正确' }
                                            ]
                                        })(
                                            <Input placeholder="请输入联系人电话" maxLength="12" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="出险日期">
                                        {getFieldDecorator('accidentDate', {
                                            initialValue: moment(new Date()),
                                            rules: [{ required: true, message: '请选择出险日期' }]
                                        })(
                                            <DatePicker
                                                showTime
                                                placeholder="请选择出险日期"
                                                format="YYYY-MM-DD HH:mm:ss"
                                                disabledDate={current => {
                                                    return current > moment().endOf('day')
                                                }}
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="出险原因">
                                        {getFieldDecorator('accidentReason', {
                                            rules: [
                                                { required: true, message: '请选择出险原因' }
                                            ]
                                        })(
                                            <Select placeholder="请选择出险原因" showSearch filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>
                                            {
                                                this.state.accidentReasons.map(item => (
                                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                                ))
                                            }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="报案医院">
                                        {getFieldDecorator('reportHospitalName')(
                                            <Input placeholder="请输入报案医院" />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="报案疾病">
                                        {getFieldDecorator('reportDiseaseName')(
                                            <Input placeholder="请输入报案疾病" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button id="$button_reportsaveid" type="primary" htmlType="submit">保存</Button>
                                    <Button id="$button_reportreturnid" style={{ marginLeft: 20 }} onClick={ this.cancel }>返回</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
    renderList() {
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center' },
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center' },
            { title: '被保险人身份证号', dataIndex: 'idCode', align: 'center' },
            { title: '保单开始时间', dataIndex: 'startDate', align: 'center' },
            { title: '保单结束时间', dataIndex: 'endDate', align: 'center' },
            { title: '险种名称', dataIndex: 'insuranceName', align: 'center' }
        ]
        let pagination = {
            total: this.state.listObj.totalElements,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: current => {
                this.getList(current)
            }
        }
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination,
            rowSelection: {
                type: 'radio',
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        selectedKeys: keys
                    })
                }
            }
        }
        return (
            <Table bordered className="list-table" {...props} />
        )
    }
    querySearch = data => {
        this.setState({
            searchData: data
        }, () => {
            this.getList(1)
        })
    }
    getList = current => {
        this.setState({
            currentPage: current,
            isLoading: true
        })
        let data = this.state.searchData
        data.permissionFlag = '1'
        data.currentPage = current
        data.pageSize = this.state.pageSize

        http.post('/rs/api/claim/reportCase/policyInfo', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false,
                curPolicyId: res.content.length > 0 ? res.content[0].id : '',
                selectedKeys: res.content.length > 0 ? [res.content[0].id] : []
            })
        })
    }
    searchSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            values.accidentDate = moment(values.accidentDate).format('YYYY-MM-DD HH:mm:ss')
            let data = values
            data['policyId'] = this.state.selectedKeys[0]
            http.post('/rs/api/claim/reportCase/add', data, { isLoading: true }).then(res => {
                message.success('报案成功！')
                this.props.result('suc')
            })
        })
    }
    cancel = () => {
        this.props.result('cancel')
    }
}
CaseAdd = Form.create()(CaseAdd)
export default CaseAdd