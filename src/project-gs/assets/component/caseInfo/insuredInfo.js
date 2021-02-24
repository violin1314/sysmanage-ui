import React, { Component } from 'react';
import { Descriptions, Row, Col,Divider } from 'antd';
import moment from 'moment'

class InsuredInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }
    componentDidMount() {
        this.setState({
            detail: this.props.detail ? this.props.detail : {}
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            detail: nextProps.detail ? nextProps.detail : {}
        })
    }
    render() {
        return (
            <div>
                <Descriptions size="small" column={1} style={{ padding: '0 20px' }}>
                    <Descriptions.Item label="出险日期">{this.state.detail.accidentDate ? moment(this.state.detail.accidentDate).format('YYYY-MM-DD') : ""}</Descriptions.Item>
                    <Descriptions.Item label="出险原因">{this.accidentReasonName(this.state.detail.accidentReason)}</Descriptions.Item>
                    <Descriptions.Item label="出险经过">{this.state.detail.accidentDescribe}</Descriptions.Item>
                    <Descriptions.Item label="出险医院">{this.state.detail.reportHospitalName}</Descriptions.Item>
                </Descriptions>
                <Divider />
            </div>

        )
    }
    accidentReasonName = (accidentReason)=>{
        var name = "";
        if(accidentReason && accidentReason == 1){
            name = "疾病";
        }
        if(accidentReason && accidentReason == 2){
            name = "意外";
        }
        return name;
    }
}
export default InsuredInfo;
