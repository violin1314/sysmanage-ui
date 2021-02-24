import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';

class CaseAddSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount(){

    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(this.props.visible !== nextProps.visible && !nextProps.visible){
            this.props.form.resetFields()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={ this.searchSubmit } className="form-search">
                <Form.Item label="个人保单号">
                    {getFieldDecorator('policyNo')(
                        <Input placeholder="请输入个人保单号" />
                    )}
                </Form.Item>
                <Form.Item label="被保险人身份证号">
                    {getFieldDecorator('idCode')(
                        <Input placeholder="请输入被保险人身份证号" style={{ width: 200 }} />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button onClick={ this.searchReset }>重置</Button>
                </Form.Item>
            </Form>
        )
    }
    searchSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            this.props.query(values)
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        this.props.query({})
    }
}
CaseAddSearch = Form.create()(CaseAddSearch)
export default CaseAddSearch;