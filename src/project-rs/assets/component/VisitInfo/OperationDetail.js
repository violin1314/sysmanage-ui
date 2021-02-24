import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';

class OperationDetail extends Component {
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
                        <Form.Item label="手术名称">{ this.state.detail.operation_name }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手术级别">{ this.state.detail.operation_level }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手术及操作编码">{ this.state.detail.operation_code }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="术前诊断编码">{ this.state.detail.before_operation_icd }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="术后诊断编码">{ this.state.detail.after_operation_icd }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手术目标部位名称">{ this.state.detail.operation_target_position }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="手术开始时间">{ this.state.detail.operation_start_dtime }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手术结束时间">{ this.state.detail.operation_end_dtime }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="介入物名称">{ this.state.detail.involve_item }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="手术体位">{ this.state.detail.operation_position }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手术史标志">{ this.state.detail.operation_history_flag }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="引流标志">{ this.state.detail.drainage_flag }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="出血量(mL)">{ this.state.detail.out_blood_amount }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="输血量(mL)">{ this.state.detail.blood_transfusion_amount }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="输血反应标志">{ this.state.detail.blood_transfusion_reaction_fla }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label="麻醉方法">{ this.state.detail.anesthesia_way }</Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="放置部位">{ this.state.detail.place_position }</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="手术过程描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.operation_process } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="手术切口描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.operation_cut } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="术前用药" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.before_operation_drug } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="引流材料名称" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.drainage_material_name } </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="引流材料数目" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>{ this.state.detail.drainage_material_amount } </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default OperationDetail;