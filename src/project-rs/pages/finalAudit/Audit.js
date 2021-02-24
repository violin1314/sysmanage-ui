import React, { Component } from 'react';
import { Form, Modal, Input, Select, Button, message } from 'antd';

import http from '@/utils/http'

class Audit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            conHeight: '',

            caseId: '',
            userInfo: JSON.parse(sessionStorage.userInfo),
            times: 0,
            isReQuery: false
        }
    }
    componentDidMount() {
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.setState({
            caseId: this.props.caseId,
            visible: this.props.visible
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.caseId || nextProps.caseId === this.props.caseId){
            return
        }
        this.setState({
            caseId: nextProps.caseId,
            visible: nextProps.visible,
            isReQuery: false
        }, () => {
            let data = {
                id: nextProps.caseId,
                policyId: nextProps.policyId,
                querySecondAuditFlag: true
            }
            http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data).then(res => {
                this.setState({
                    times: res.caseFinalAuditingInfoEntityDs ? res.caseFinalAuditingInfoEntityDs.length + 1 : 1,
                    isReQuery: res.caseInfo.finalCheckFlag === '0'
                })
            })
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title="终审信息录入"
                width="800px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel }
                footer={ null }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    <Form.Item label="审核状态">
                        {getFieldDecorator('state', {
                            rules: [{ required: true, message: '请选择审核状态' }]
                        })(
                            <Select placeholder="请选择审核状态">
                                <Select.Option value="1">通过</Select.Option>
                                <Select.Option value="0">不通过</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="终审员">
                        {getFieldDecorator('operName', {
                            initialValue: this.state.userInfo.user_name
                        })(
                            <Input disabled placeholder="请输入终审员" />
                        )}
                    </Form.Item>
                    <Form.Item label="终审次数">
                        {getFieldDecorator('timesNum', {
                            initialValue: this.state.times
                        })(
                            <Input disabled placeholder="请输入终审次数" />
                        )}
                    </Form.Item>
                    <Form.Item label="终审结论">
                        {getFieldDecorator('summary', {
                            rules: [{ required: true, message: '请输入终审结论' }]
                        })(
                            <Input.TextArea placeholder="请输入终审结论" />
                        )}
                    </Form.Item>
                    <Form.Item label="终审意见">
                        {getFieldDecorator('oppositopn')(
                            <Input.TextArea placeholder="请输入终审意见" />
                        )}
                    </Form.Item>
                    <Form.Item label="备注信息">
                        {getFieldDecorator('remark')(
                            <Input.TextArea placeholder="请输入备注信息" />
                        )}
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" id="$button_final_pass" htmlType="submit" disabled={ this.state.isReQuery }>终审完成</Button>
                        <Button type="primary" onClick={ this.reQuery } style={{ marginLeft: 20 }} disabled={ !this.state.isReQuery }>补传</Button>
                        <Button onClick={ this.cancel } style={{ marginLeft: 20 }}>返回</Button>
                    </div>
                </Form>
            </Modal>
        )
    }
    cancel = flag => {
        this.props.form.resetFields()
        this.setState({
            visible: false
        })
        this.props.onClose(flag)
    }
    
    onSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            let data = values
            data.indemnityCaseId = this.state.caseId
            data.operCode = this.state.userInfo.org_code
            http.post('/rs/api/claim/auditFinal/addCaseAuditFinalInfo', data, { isLoading: true }).then(res => {
                message.success(res.message)
                if(res.finalCheckFlag === '0'){
                    this.setState({
                        isReQuery: true
                    })
                }else{
                    this.cancel('suc')
                }
            })
        })
    }
    reQuery = () => {
        http.post('/rs/api/claim/auditFinal/addCaseAuditFinalInfoSupplement', { id: this.state.caseId }, { isLoading: true }).then(res => {
            message.success(res.message)
            if(res.finalCheckFlag === '0'){
                this.setState({
                    isReQuery: true
                })
            }else{
                this.setState({
                    isReQuery: false
                })
                this.cancel('suc')
            }
        })
    }
}
Audit = Form.create()(Audit)
export default Audit