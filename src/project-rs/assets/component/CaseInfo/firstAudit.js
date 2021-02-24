import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';

class FirstAudit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }
    componentDidMount() {
        this.setState({
            detail: this.props.detail && this.props.detail.length > 0 ? this.props.detail[0] : {}
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            detail: nextProps.detail && nextProps.detail.length > 0 ? nextProps.detail[0] : {}
        })
    }
    render() {
        return (
            <Form layout="inline" className="audit-from">
                <Row>
                    <Col span={8}>
                        <Form.Item label="审核状态">
                            <Input value={ this.state.detail.state && this.state.detail.state === '0' ? '不通过' : '通过' } readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="初审次数">
                            <Input value={ this.state.detail.timesNum } readOnly />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="操作员编码">
                            <Input value={ this.state.detail.createdBy } readOnly />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="初审结论">
                            <Input.TextArea value={ this.state.detail.result } row={4} style={{ width: 840, minHeight: 80 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label="备注信息">
                            <Input.TextArea value={ this.state.detail.remark } row={4} style={{ width: 840, minHeight: 80 }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default FirstAudit;