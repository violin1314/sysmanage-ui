import React, { Component } from 'react'
import { Row, Col, Form, InputNumber, Select, Input, DatePicker, message, Button } from 'antd';
import moment from 'moment';
import utils from '@/utils'

import ItemSelect from './ItemSelect'
const limitDecimals = value => {
    const reg = /^(\d-)*(\d+)\.(\d\d).*$/;
    if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
    } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    } else {
        return ''
    }
}
class ApplyInputForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            curVisit: {},
            reporterChannels: [],
            medTypes: [],
            reportCancelReasons: [],
            insuredCitys: []
        }
    }
    componentDidMount() {
        this.setState({
            curVisit: this.props.curVisit ? this.props.curVisit : {}
        })
        utils.getCodeList(['reporter_channel', 'med_type', 'report_cancel_reason', 'insured_city_code'], res => {
            this.setState({
                reporterChannels: res[0].value,
                medTypes: res[1].value,
                reportCancelReasons: res[2].value,
                insuredCitys: res[3].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            curVisit: nextProps.curVisit ? nextProps.curVisit : {}
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 15 }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={ this.onSubmit } style={{ padding: 10, margin: 15, border: '1px solid #ddd' }}>
                <Row style={{ paddingBottom: 20 }}>
                    <Col span={8}>
                        <Form.Item label="医院名称">
                            {getFieldDecorator('medicalOrganization', {
                                rules: [{ required: true, message: '请选择医院名称' }],
                                initialValue: this.state.curVisit.medicalOrganizationName ? {
                                    label: this.state.curVisit.medicalOrganizationName,
                                    key: this.state.curVisit.medicalOrganizationCode
                                } : undefined
                            })(
                                <ItemSelect
                                    label="医院"
                                    valueName="orgName"
                                    valueCode="orgCode"
                                    url="/rs/api/claim/hospitalInfo/findHospitalInfoByContion"
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="入院科室">
                            {getFieldDecorator('inhosDepartment', {
                                rules: [{ required: true, message: '请输入入院科室' }],
                                initialValue: this.state.curVisit.inhosDepartment
                            })(
                                <Input placeholder="请输入入院科室" autoComplete="off" onChange={this.changeForm} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="入院日期" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('inHosDate', {
                                rules: [{ required: true, message: '请选择入院日期' }],
                                initialValue: this.state.curVisit.inHosDate ? moment(this.state.curVisit.inHosDate) : undefined
                            })(
                                <DatePicker placeholder="请选择入院日期" style={{ width: '100%' }} onChange={this.changeForm} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="出院日期">
                            {getFieldDecorator('outHosDate', {
                                rules: [{ required: true, message: '请选择出院日期' }],
                                initialValue: this.state.curVisit.outHosDate ? moment(this.state.curVisit.outHosDate) : undefined
                            })(
                                <DatePicker placeholder="请选择出院日期" style={{ width: '100%' }} onChange={this.changeForm} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医疗总费用">
                            {getFieldDecorator('medicalTotalMoney', {
                                rules: [{ required: true, message: '请输入医疗总费用' }],
                                initialValue: this.state.curVisit.medicalTotalMoney
                            })(
                                <InputNumber min={0} placeholder="请输入医疗总费用" onChange={this.changeForm} step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="其他途径报销金额" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('otherPayMoney', {
                                initialValue: this.state.curVisit.otherPayMoney
                            })(
                                <InputNumber min={0} placeholder="请输入其他途径报销金额" step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }} onChange={this.changeForm} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="出院诊断">
                            {getFieldDecorator('outhosDiagnoseItem', {
                                rules: [{ required: true, message: '请选择出院诊断' }],
                                initialValue: this.state.curVisit.outhosDiagnose ? {
                                    label: this.state.curVisit.outhosDiagnose,
                                    key: this.state.curVisit.outhosDiagnoseCode
                                } : undefined
                            })(
                                <ItemSelect
                                    label="出院诊断"
                                    valueName="diseaseName"
                                    valueCode="diseaseCode"
                                    url="/rs/api/claim/diseaseInfo/findDiseaseInfoByContion"
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医疗大类">
                            {getFieldDecorator('medType', {
                                rules: [{ required: true, message: '请选择医疗大类' }],
                                initialValue: this.state.curVisit.medType
                            })(
                                <Select placeholder="请选择医疗大类" onChange={this.changeForm}>
                                    {
                                        this.state.medTypes.map(item => (
                                            <Select.Option key={item.codeValue} value={item.codeValue}>{item.codeName}</Select.Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="发票号" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('billNo', {
                                rules: [{ required: true, message: '请输入发票号' }],
                                initialValue: this.state.curVisit.billNo
                            })(
                                <Input placeholder="多个发票号请用 | 分隔" autoComplete="off" onChange={this.changeForm} style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="乙类自理金额">
                            {getFieldDecorator('partSelfAmnt', {
                                initialValue: this.state.curVisit.partSelfAmnt
                            })(
                                <Input readOnly style={{ border: 'none' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="自费金额">
                            {getFieldDecorator('selfAmnt', {
                                initialValue: this.state.curVisit.selfAmnt
                            })(
                                <Input readOnly style={{ border: 'none' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="社保支付金额" labelCol={{ span: 9 }} wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('siCost', {
                                initialValue: this.state.curVisit.siCost
                            })(
                                <InputNumber min={0} placeholder="请输入社保支付金额" step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }} onChange={this.changeSiCost} />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ textAlign: 'center' }}>
                    <Button type="primary" onClick={ this.onSubmit }>确认</Button>
                    <Button onClick={ this.cancel } style={{ marginLeft: 20 }}>取消</Button>
                </Row>
            </Form>
        )
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            let inHosDate = moment(values.inHosDate).format('YYYY-MM-DD')
            let outHosDate = moment(values.outHosDate).format('YYYY-MM-DD')

            if(moment(inHosDate).isAfter(moment(outHosDate))){
                message.error('入院日期不能晚于出院日期')
                return
            }
            if(values.billNo){
                let billNos = []
                billNos = values.billNo.split('|')
                billNos = billNos.filter(s => s && s.trim());
                values.billNo = billNos.join('|')
            }

            let visitInfo = values

            let medicalOrganization = values.medicalOrganization
            let outhosDiagnose = values.outhosDiagnoseItem
            visitInfo['medicalOrganizationCode'] = medicalOrganization.key
            visitInfo['medicalOrganizationName'] = medicalOrganization.label
            visitInfo['outhosDiagnose'] = outhosDiagnose.label
            visitInfo['outhosDiagnoseCode'] = outhosDiagnose.key
            visitInfo['inHosDate'] = moment(values.inHosDate).format('YYYY-MM-DD')
            visitInfo['outHosDate'] = moment(values.outHosDate).format('YYYY-MM-DD')
            delete visitInfo.medicalOrganization
            delete visitInfo.outhosDiagnoseItem

            if(this.state.curVisit.key){
                visitInfo['key'] = this.state.curVisit.key
            }
            if(this.state.curVisit.id){
                visitInfo['id'] = this.state.curVisit.id
            }

            this.state.medTypes.forEach(md => {
                if(md.codeValue === values.medType){
                    visitInfo['medTypeName'] = md.codeName
                }
            })

            this.props.onQuery(visitInfo)
        })
    }
    cancel = () => {
        this.props.form.resetFields()
        this.props.onCancel()
    }
}
ApplyInputForm = Form.create()(ApplyInputForm)
export default ApplyInputForm