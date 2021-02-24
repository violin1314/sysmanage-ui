import React, { Component } from 'react';
import { Form, Button, Input, Select, Spin, message } from 'antd';

import http from '@/utils/http'
import utils from '@/utils'
import FixedImgs from './other/FixedImgs'

class BankInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            policyId: '',
            caseId: '',
            disposeState: '',
            detail: {},
            isLoading: false,

            payeeTypes: [],
            accountTypes: [],
            banks: []
        }
    }
    componentDidMount() {
        this.setState({
            policyId: this.props.policyId,
            caseId: this.props.caseId,
            disposeState: this.props.disposeState
        }, () => {
            if(this.state.disposeState === '3'){
                this.getPayInfo()
            }else{
                this.getDetail()
            }
        })

        utils.getCodeList(['payee_type', 'account_type', 'bank_code'], res => {
            this.setState({
                payeeTypes: res[0].value,
                accountTypes: res[1].value,
                banks: res[2].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.policyId || nextProps.policyId === this.props.policyId){
            return
        }
        this.props.form.resetFields()
        this.setState({
            policyId: nextProps.policyId,
            caseId: nextProps.caseId,
            disposeState: nextProps.disposeState,
            isLoading: false
        }, () => {
            if(this.state.disposeState === '3'){
                this.getPayInfo()
            }else{
                this.getDetail()
            }
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Spin spinning={ this.state.isLoading }>
                <FixedImgs id={ this.state.caseId } />
                <Form {...formItemLayout} onSubmit={ this.searchSubmit } className="query-form" style={{ padding: '10px 20px' }}>
                    <Form.Item label="领款人类型">
                        {getFieldDecorator('payeeType', {
                            initialValue: this.state.detail.payeeType,
                            rules: [{ required: true, message: '请选择领款人类型' }]
                        })(
                            <Select placeholder="请选择领款人类型">
                            {
                                this.state.payeeTypes.map(item => (
                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="领款人姓名">
                        {getFieldDecorator('payeeName', {
                            initialValue: this.state.detail.payeeName ? this.state.detail.payeeName : this.state.detail.insuredName,
                            rules: [{ required: true, message: '请输入领款人姓名' }]
                        })(
                            <Input placeholder="请输入领款人姓名" />
                        )}
                    </Form.Item>
                    <Form.Item label="银行账号">
                        {getFieldDecorator('bankAccountNo', {
                            initialValue: this.state.detail.bankAccountNo,
                            rules: [{ required: true, message: '请输入银行账号' }]
                        })(
                            <Input placeholder="请输入银行账号" />
                        )}
                    </Form.Item>
                    <Form.Item label="账户类型">
                        {getFieldDecorator('accountType', {
                            initialValue: this.state.detail.accountType,
                            rules: [{ required: true, message: '请选择账户类型' }]
                        })(
                            <Select placeholder="请选择账户类型">
                            {
                                this.state.accountTypes.map(item => (
                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="领款人证件号">
                        {getFieldDecorator('payeeIdcard', {
                            initialValue: this.state.detail.payeeIdcard ? this.state.detail.payeeIdcard : this.state.detail.idCode,
                            rules: [{ required: true, message: '请输入领款人证件号' }]
                        })(
                            <Input placeholder="请输入领款人证件号" />
                        )}
                    </Form.Item>
                    <Form.Item label="领款人联系电话">
                        {getFieldDecorator('payeePhone', {
                            initialValue: this.state.detail.payeePhone ? this.state.detail.payeePhone : this.state.detail.telephone,
                            rules: [
                                { required: true, message: '请输入领款人联系电话' },
                                { pattern: /^\d{8,12}$/, message: '电话格式不正确' }
                            ]
                        })(
                            <Input placeholder="请输入领款人联系电话" maxLength={12} />
                        )}
                    </Form.Item>
                    <Form.Item label="开户行">
                        {getFieldDecorator('bankCode', {
                            initialValue: this.state.detail.bankCode,
                            rules: [{ required: true, message: '请选择开户行' }]
                        })(
                            <Select
                                placeholder="请选择开户行"
                                showSearch
                                filterOption={(input, option) =>
                                    option.props.children.indexOf(input) >= 0
                                }
                            >
                            {
                                this.state.banks.map(item => (
                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 18, offset: 6 }} style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" id="$BankInputSubmit">确定</Button>
                        <Button onClick={ this.cancel } style={{ marginLeft: 10 }} id="$BankInputCancel">返回</Button>
                    </Form.Item>
                </Form>
            </Spin>
        )
    }
    getDetail = () => {
        this.setState({
            isLoading: true,
            detail: {}
        })
        http.post('/rs/api/claim/policyPerson/findPolicyPersonByID', { id: this.state.policyId }).then(res => {
            this.setState({
                detail: res.insuredInfoEntity,
                isLoading: false
            })
        })
    }
    getPayInfo = () => {
        this.setState({
            isLoading: true,
            detail: {}
        })
        http.post('/rs/api/claim/casepayinfo/findCasePayInfoByCaseId', { id: this.state.caseId }).then(res => {
            this.setState({
                detail: res,
                isLoading: false
            })
        })
    }
    searchSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            values['indemnityCaseId'] = this.state.caseId;
            let url = '/rs/api/claim/insuredinfo/updateInsuredInfo'

            if(this.state.disposeState === '3'){
                let bankName = '';
                this.state.banks.forEach(item => {
                    if(item.codeValue === values.bankCode){
                        bankName = item.codeName
                    }
                })
                values['bankName'] = bankName
                url = '/rs/api/claim/casepayinfo/saveCasePayInfo';
            }else{
                values['id'] = this.state.detail.id
            }

            http.post(url, values, { isLoading: true }).then(res2 => {
                message.success('保存银行信息成功')
                this.props.onClose('suc')
            })
        })
    }
    cancel = () => {
        this.props.form.resetFields()
        this.props.onClose()
    }
}
BankInput = Form.create()(BankInput)
export default BankInput;