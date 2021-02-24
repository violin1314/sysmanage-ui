import React, { Component } from 'react';
import { Form, Modal, Row, Col, Input, Radio, Select, Button, Table, message } from 'antd';

import http from '@/utils/http'
import moment from 'moment'
import EditableCell from './CheckTableCell'

const initProducts = [
    { key: '1', index: 1, taskDescribe: '核对保单信息、核实被保险人身份、受益人身份；' },
    { key: '2', index: 2, taskDescribe: '核实治疗及身故的时间和真实性;' },
    { key: '3', index: 3, taskDescribe: '走访知情人;' },
    { key: '4', index: 4, taskDescribe: '了解被保险人的既往史，调病历、走访治疗医院;' },
    { key: '5', index: 5, taskDescribe: '排查除外责任;' }
]

class Check extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            conHeight: '',

            curCase: {},
            userInfo: JSON.parse(sessionStorage.userInfo),
            investigations: [],

            products: [],
            count: 6,
            selectedRowKeys: [],
            selectedTaskRows: []
        }
    }
    componentDidMount() {
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.setState({
            curCase: this.props.case,
            visible: this.props.visible,
            products: initProducts
        }, () => {
            this.getTimes()
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.case.id || nextProps.case.id === this.props.case.id) {
            return
        }
        this.setState({
            curCase: nextProps.case,
            visible: nextProps.visible,
            products: initProducts,
            selectedRowKeys: []
        }, () => {
            this.getTimes()
        })
    }
    getTimes = () => {
        if(!this.state.curCase.id) {
            return
        }
        let data = {
            id: this.state.curCase.id,
            policyId: this.state.curCase.policyId,
            queryInvestFlag: true
        }

        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data).then(res => {
            this.setState({
                investigations: res.caseInvestigationInfoDs
            })
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 15 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title="调查任务描述"
                width="1200px"
                centered
                visible={this.state.visible}
                onCancel={this.cancel}
                footer={null}
            >
                <Form {...formItemLayout} onSubmit={this.onSubmit} style={{ padding: 20 }}>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="是否即时调查">
                                {getFieldDecorator('isImmediate', {
                                    initialValue: 1
                                })(
                                    <Radio.Group>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={0}>否</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="事故类型">
                                {getFieldDecorator('accidentType', {
                                    initialValue: '01',
                                    rules: [
                                        { required: true, message: '请选择事故类型' }
                                    ]
                                })(
                                    <Select placeholder="请选择事故类型" style={{ width: '100%' }} >
                                        <Select.Option value="01">疾病医疗</Select.Option>
                                        <Select.Option value="02">意外医疗</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="调查次数">
                                {getFieldDecorator('timesNum', {
                                    initialValue: this.state.investigations.length + 1
                                })(
                                    <Input readOnly />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item label="任务发起机构">
                                {getFieldDecorator('taskLaunchOrg', {
                                    initialValue: this.state.userInfo.org_name
                                })(
                                    <Input placeholder="任务发起机构" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="任务发起人">
                                {getFieldDecorator('taskLaunchPer', {
                                    initialValue: this.state.userInfo.user_name
                                })(
                                    <Input readOnly />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="任务发起日期">
                                {getFieldDecorator('taskLaunchDate', {
                                    initialValue: moment(new Date()).format('YYYY-MM-DD'),
                                })(
                                    <Input readOnly />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    {this.renderList()}
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button onClick={this.cancel} style={{ marginLeft: 20 }}>返回</Button>
                    </div>
                </Form>
            </Modal>
        )
    }
    renderList() {
        const columns = [
            { title: '序号', dataIndex: 'index', width: 150 },
            {
                title: '任务', dataIndex: 'taskDescribe',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(record.key, 'taskDescribe')}
                    />
                )
            }
        ]
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                this.setState({ selectedRowKeys: selectedRowKeys });
                this.setState({ selectedTaskRows: selectedRows });
            }
        }
        const tableProps = {
            columns: columns,
            rowKey: 'key',
            rowSelection: rowSelection,
            pagination: false,
            dataSource: this.state.products,
            size: "middle"
        }
        return (
            <div>
                <Button type="primary" onClick={this.handleAdd} style={{ marginBottom: 10 }}>添加</Button>
                <Table bordered className="list-table" {...tableProps} />
            </div>
        );
    }
    handleAdd = () => {
        const { count, products } = this.state;
        const newData = {
            key: count,
            index: count,
            taskDescribe: ''
        }
        this.setState({
            products: [...products, newData],
            count: count + 1,
        })
    }
    onCellChange = (key, dataIndex) => {
        return value => {
            const dataSource = [...this.state.products];
            const target = dataSource.find(item => item.key === key);
            if(target) {
                target[dataIndex] = value;
                this.setState({ dataSource });
            }
        };
    }
    cancel = flag => {
        this.props.form.resetFields()
        this.setState({
            visible: false,
            selectedRowKeys: []
        })
        this.props.onClose(flag)
    }

    onSubmit = e => {
        e.preventDefault()
        if(this.state.selectedTaskRows.length === 0){
            message.error('请至少选择一条调查任务')
            return
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }

            let str = '';
            for(let i = 0; i < this.state.selectedTaskRows.length; i++){
                str += this.state.selectedTaskRows[i].taskDescribe;
                if(i !== this.state.selectedTaskRows.length - 1){
                    str = str + ' '
                }
            }

            let data = values
            data.taskLaunchPerCode = this.state.userInfo.user_code
            data.taskDescribe = str
            data.assuredProfessionKind = this.props.selectInsuedInfo.professionKind
            data.assuredUnit = '';
            data.indemnityCaseId = this.state.curCase.id
            http.post('/rs/api/claim/investigation/addInvestigation', data, { isLoading: true }).then(res => {
                message.success('稽核成功')
                this.cancel('suc')
            })
        })
    }
}
Check = Form.create()(Check)
export default Check