import React, { Component } from 'react';
import { Form, Modal, Input, message } from 'antd';

import http from '@/utils/http'

class Reopen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            caseId: '',
            id: ''
        }
    }
    componentDidMount() {
        this.setState({
            caseId: this.props.caseId,
            id: this.props.id,
            visible: this.props.visible
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.caseId || nextProps.caseId === this.props.caseId){
            return
        }
        this.setState({
            caseId: nextProps.caseId,
            id: nextProps.id,
            visible: nextProps.visible
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                className="modal-detail"
                title="申请重开赔案"
                width="600px"
                centered
                visible={ this.state.visible }
                onCancel={ this.cancel.bind(this, '1') }
                onOk={ this.onSubmit }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    <Form.Item label="重开赔案原因">
                        {getFieldDecorator('renewApplyReason', {
                            rules: [{ required: true, message: '请输入重开赔案原因' }]
                        })(
                            <Input.TextArea rows={4} placeholder="请输入重开赔案原因" />
                        )}
                    </Form.Item>
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
            if(this.state.id){
                data.id = this.state.id
            }

            http.post('/rs/api/claim/renewcaseinfo/saveRenewCaseInfo', data, { isLoading: true }).then(res => {
                message.success('申请重开赔案成功')
                this.cancel('suc')
            })
        })
    }
}
Reopen = Form.create()(Reopen)
export default Reopen