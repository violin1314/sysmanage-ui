import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

class SiPayDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }
    componentDidMount() {
        this.init(this.props.detail)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.init(nextProps.detail)
    }
    init(detail){
        this.setState({
            detail
        })
    }
    render() {
        const itemlabel = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }
        return (
            <Form className="data-form" {...itemlabel}>
                <Row>
                    <Col span={8}>
                        <Form.Item label="单据号">{ this.state.detail.bill_no }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医疗类别">{ this.state.detail.medical_kind }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医疗人员类别">{ this.state.detail.person_type }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="结算时间">{ this.state.detail.pay_date }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医疗总费用">{ this.state.detail.medical_total_noney }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="现金支付">{ this.state.detail.own_pay }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="个人账户支付">{ this.state.detail.medical_person_pay }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医保统筹支付">{ this.state.detail.medical_plan_pay }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="大病支付">{ this.state.detail.salvage_money }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="公务员补助支付">{ this.state.detail.gov_emp_subsidy }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="低保补助">{ this.state.detail.subsistence_security }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="企业补充基金">{ this.state.detail.ent_sup_fund }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="个人补充基金">{ this.state.detail.perSupFundPayment }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="药品费用">{ this.state.detail.drug_cost }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="诊疗项目费用">{ this.state.detail.clinic_items_cost }</Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default SiPayDetail;