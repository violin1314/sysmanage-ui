import React, { Component } from 'react';
import { Form, Button, Select, InputNumber } from 'antd';

import utils from '@/utils/index'
const limitDecimals = value => {
    const reg = /^(\d-)*(\d+)\.(\d\d).*$/;
    if(typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
    } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    } else {
        return ''
    }
}
class PrescriptionCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            types: []
        }
    }
    componentDidMount() {
        utils.getCodeList(['item_type_yb'], res => {
            this.setState({
                types: res[0].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            this.props.form.resetFields()
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Form {...formItemLayout} onSubmit={ this.searchSubmit }>
                <Form.Item label="费用类别">
                    {getFieldDecorator('itemTypeYb', {
                        rules: [{ required: true, message: '请选择费用类别' }]
                    })(
                        <Select placeholder="请选择费用类别" labelInValue>
                        {
                            this.state.types.map(item => (
                                <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                            ))
                        }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="费用金额">
                    {getFieldDecorator('money', {
                        rules: [{ required: true, message: '请输入费用金额' }]
                    })(
                        <InputNumber placeholder="请输入费用金额" min={0} step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%'}} />
                    )}
                </Form.Item>
                <Form.Item label="社保已支付金额">
                    {getFieldDecorator('securityAmnt')(
                        <InputNumber placeholder="请输入社保已支付金额" min={0} step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%'}} />
                    )}
                </Form.Item>
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button onClick={ this.cancel } style={{ marginLeft: 20 }}>取消</Button>
                </div> 
            </Form>
        )
    }
    searchSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            let data = {
                itemTypeYb: values.itemTypeYb.key,
                itemTypeYbName: values.itemTypeYb.label,
                money: values.money,
                securityAmnt: values.securityAmnt
            }
            this.props.onQuery(data)
        })
    }
    cancel = () => {
        this.props.form.resetFields()
        this.props.onQuery('cancel')
    }
}
PrescriptionCreate = Form.create()(PrescriptionCreate)
export default PrescriptionCreate;