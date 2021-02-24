import React, { Component } from 'react'
import { Modal, Row, Col, Form, InputNumber, Select } from 'antd';
import http from '@/utils/http'
import utils from '@/utils'
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
class SiCost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            hospitalLevels: []
        }
    }
    componentDidMount(){
        if(!this.props.visible){
            return
        }
        this.setState({
            visible: this.props.visible
        })
        this.props.form.setFieldsValue({
            medicalTotalMoney: this.props.data.medicalTotalMoney,
            partSelfAmnt: this.props.data.partSelfAmnt,
            selfAmnt: this.props.data.selfAmnt
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.visible || nextProps.visible === this.state.visible){
            return
        }
        this.setState({
            visible: nextProps.visible
        })
        this.props.form.resetFields()
        this.props.form.setFieldsValue({
            medicalTotalMoney: nextProps.data.medicalTotalMoney,
            partSelfAmnt: nextProps.data.partSelfAmnt,
            selfAmnt: nextProps.data.selfAmnt
        })
        utils.getCodeList(['trial_hospital_level'], res => {
            this.setState({
                hospitalLevels: res[0].value
            })
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                className="modal-detail"
                title="试算社保支"
                width="800px"
                centered
                visible={ this.state.visible }
                onOk={ this.onSubmit }
                onCancel={ this.close }
            >
                <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 20 }}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="总费用">
                                {getFieldDecorator('medicalTotalMoney', {
                                    rules: [{ required: true, message: '请输入总费用' }]
                                })(
                                    <InputNumber min={0} placeholder="请输入总费用" step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="自理金额">
                                {getFieldDecorator('partSelfAmnt', {
                                    rules: [{ required: true, message: '请输入自理金额' }]
                                })(
                                    <InputNumber min={0} placeholder="请输入自理金额" step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="自费金额">
                                {getFieldDecorator('selfAmnt', {
                                    rules: [{ required: true, message: '请输入自费金额' }]
                                })(
                                    <InputNumber min={0} placeholder="请输入自费金额" step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="医院等级">
                                {getFieldDecorator('hospitalLevel', {
                                    rules: [{ required: true, message: '请选择医院等级' }]
                                })(
                                    <Select placeholder="请选择医院等级">
                                    {
                                        this.state.hospitalLevels.map(item => (
                                            <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                        ))
                                    }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
    
    onSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            let data = values
            http.post('/rs/api/claim/visitInfo/trialSiCost', data, { isLoading: true }).then(res => {
                this.props.onOk(res)
                this.close()
            })
        })
    }
    close = () => {
        this.props.form.resetFields()
        this.setState({
            visible: false
        })
        this.props.onCancel()
    }
}
SiCost = Form.create()(SiCost)
export default SiCost