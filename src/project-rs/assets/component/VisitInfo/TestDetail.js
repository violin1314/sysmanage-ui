import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

class TestDetail extends Component {
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
                        <Form.Item label="检验报告单编号">{ this.state.detail.test_no }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检验项目代码">{ this.state.detail.test_item_code }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检验方法名称">{ this.state.detail.test_name }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="检验结果">{ this.state.detail.test_results_code }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="参考值">{ this.state.detail.test_reference_value }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="单位">{ this.state.detail.test_measurement_units }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="检验类别">{ this.state.detail.test_kind }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检验项目序号">{ this.state.detail.test_item_no }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="标本类别">{ this.state.detail.sample_kind }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="接收标本日期">{ this.state.detail.sample_receive_date }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检验标本号">{ this.state.detail.test_sample_no }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="标本状态">{ this.state.detail.sample_status }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="报告日期">{ this.state.detail.out_blood_amount }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="临床诊断" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.clinical_diagnosis } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检验报告" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.test_report } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检验报告结果" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.test_report_result } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检验报告备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.test_report_memo } </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default TestDetail;