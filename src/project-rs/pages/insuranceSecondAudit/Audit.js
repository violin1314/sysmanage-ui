import React, { Component } from 'react';
import { Form, Modal, Input, Button, message } from 'antd';

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
            isReQuery: false,

            reasonVisible: false,
            reason: undefined
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
            http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data, { isLoading: true }).then(res => {
                this.setState({
                    times: res.caseArtificialSecondAuditInfoDs ? res.caseArtificialSecondAuditInfoDs.length + 1 : 1,
                    isReQuery: res.caseInfo.secondCheckFlag === '0'
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
                title="复审信息录入"
                width="800px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel }
                footer={ null }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    <Form.Item label="复审员">
                        {getFieldDecorator('operName', {
                            initialValue: this.state.userInfo.user_name
                        })(
                            <Input disabled placeholder="请输入复审员" />
                        )}
                    </Form.Item>
                    <Form.Item label="复审次数">
                        {getFieldDecorator('timesNum', {
                            initialValue: this.state.times
                        })(
                            <Input disabled placeholder="请输入复审次数" />
                        )}
                    </Form.Item>
                    <Form.Item label="复审结论">
                        {getFieldDecorator('summary', {
                            rules: [{ required: true, message: '请输入复审结论' }]
                        })(
                            <Input.TextArea placeholder="请输入复审结论" />
                        )}
                    </Form.Item>
                    <Form.Item label="复审意见">
                        {getFieldDecorator('oppositopn')(
                            <Input.TextArea placeholder="请输入复审意见" />
                        )}
                    </Form.Item>
                    <Form.Item label="备注信息">
                        {getFieldDecorator('remark')(
                            <Input.TextArea placeholder="请输入备注信息" />
                        )}
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" id="$button_check_pass" htmlType="submit" disabled={ this.state.isReQuery }>复审通过</Button>
                        <Button type="primary" onClick={ this.reBack } style={{ marginLeft: 20 }}>退回受理</Button>
                        <Button type="primary" onClick={ this.reQuery } style={{ marginLeft: 20 }} disabled={ !this.state.isReQuery }>补传</Button>
                        <Button onClick={ this.cancel } style={{ marginLeft: 20 }}>返回</Button>
                    </div>
                </Form>
                { this.renderReasonModal() }
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
            data.state = '1'
            data.indemnityCaseId = this.state.caseId
            http.post('/rs/api/claim/caseSecondCheck/auditArtificialDone', data, { isLoading: true }).then(res => {
                message.success(res.message)
                if(res.secondCheckFlag === '0'){
                    this.setState({
                        isReQuery: true
                    })
                    this.props.onReload()
                }else{
                    this.cancel('suc')
                }
            })
        })
    }
    reQuery = () => {
        http.post('/rs/api/claim/caseSecondCheck/auditArtificialDoneSupplement', { id: this.state.caseId }, { isLoading: true }).then(res => {
            message.success(res.message)
            if(res.secondCheckFlag === '0'){
                this.setState({
                    isReQuery: true
                })
                this.props.onReload()
            }else{
                this.setState({
                    isReQuery: false
                })
                this.cancel('suc')
            }
        })
    }

    reBack = () => {
        this.setState({
            reasonVisible: true,
            reason: undefined
        })
    }
    renderReasonModal(){
        return (
            <Modal
                className="modal-detail"
                title="退回受理原因"
                width="600px"
                centered
                visible={ this.state.reasonVisible }
                onCancel={ this.reasonCancel }
                onOk={ this.queryReturn }
            >
                <div style={{ padding: 30, paddingTop: 10 }}>
                    <Form.Item label="退回受理原因 (非必填)">
                        <Input.TextArea
                            placeholder="请输入退回受理原因"
                            value={ this.state.reason }
                            rows={4}
                            onChange={ this.changeReason }
                        />
                    </Form.Item>
                </div>
            </Modal>
        )
    }
    changeReason = e => {
        this.setState({
            reason: e.target.value
        })
    }
    reasonCancel = () => {
        this.setState({
            reasonVisible: false,
            reason: undefined
        })
    }
    queryReturn = () => {
        let data = {
            indemnityCaseId: this.state.caseId,
            secondReturnReasn: this.state.reason
        }
        http.post('/rs/api/claim/caseSecondCheck/returnAccept', data, { isLoading: true }).then(res => {
            this.reasonCancel()
            message.success('退回受理成功')
            this.cancel('suc')
        })
    }
}
Audit = Form.create()(Audit)
export default Audit