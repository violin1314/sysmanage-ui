import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

class DischargeSummary extends Component {
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
                        <Form.Item label="科别">{ this.state.detail.department }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="入院日期">{ this.state.detail.in_hos_date }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="出院日期">{ this.state.detail.out_hos_date }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="入院诊断" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.in_hos_diagnosis } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="出院诊断" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.out_hos_diagnosis } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="入院情况" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.in_hos_situation } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="诊治经过及结果" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.treatment_process } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="出院情况" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.out_hos_situation } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="出院医嘱" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.out_advice } </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default DischargeSummary;