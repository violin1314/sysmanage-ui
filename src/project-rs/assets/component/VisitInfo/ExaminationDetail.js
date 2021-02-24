import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

class ExaminationDetail extends Component {
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
                        <Form.Item label="检查类型">{ this.state.detail.examination_type }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检查项目(设备类型)">{ this.state.detail.examination_item }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="影像与超声检查">{ this.state.detail.examination_image }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="检查日期">{ this.state.detail.sample_date }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检查报告单">{ this.state.detail.examination_report_no }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="标本固定液">{ this.state.detail.sample_stationary_liquid }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="标本类别">{ this.state.detail.sample_kind }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="检查标本号">{ this.state.detail.examination_sample_no }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="标本状态">{ this.state.detail.sample_status }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="主诉" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.case_main } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="症状描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.symptom } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="诊疗过程描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.treat_process } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检查报告结果客观所见" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.examination_report_object } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检查报告结果主观提示" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.examination_report_subject } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检查报告" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.examination_report } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="检查报告备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.examination_report_memo } </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default ExaminationDetail;