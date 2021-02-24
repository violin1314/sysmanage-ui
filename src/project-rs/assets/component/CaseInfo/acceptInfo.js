import React, { Component } from 'react';
import { Divider, Descriptions, Table } from 'antd';
import http from '@/utils/http';
import moment from 'moment'

class AcceptInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {},
            questionList: []
        }
    }
    componentDidMount() {
        this.setState({
            detail: this.props.detail ? this.props.detail : {}
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // let oldNo = this.props.detail && this.props.detail.reportNo ? this.props.detail.reportNo : '';
        // let newNo = nextProps.detail && nextProps.detail.reportNo ? nextProps.detail.reportNo : '';
        this.setState({
            detail: nextProps.detail ? nextProps.detail : {}
        }, () => {
            // if(newNo === oldNo){
            //     return
            // }
            this.getQuestions()
        })
    }
    render() {
        return (
            <div>
                <Descriptions size="small" style={{ padding: '0 20px' }}>
                    <Descriptions.Item label="赔案号">{ this.state.detail.indemnityCaseNo }</Descriptions.Item>
                    <Descriptions.Item label="案件状态">{ this.state.detail.caseStateName }</Descriptions.Item>
                    <Descriptions.Item label="报案方式">{ this.state.detail.reporterChannelName }</Descriptions.Item>
                    <Descriptions.Item label="出险日期">{ this.state.detail.accidentDate ? moment(this.state.detail.accidentDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                    <Descriptions.Item label="出险原因">{ this.state.detail.accidentReasonName }</Descriptions.Item>
                    <Descriptions.Item label="立案日期">{ this.state.detail.reporterDate ? moment(this.state.detail.reporterDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                    <Descriptions.Item label="立案员编号">{ this.state.detail.caseAcceptOper }</Descriptions.Item>
                    <Descriptions.Item label="结案日期">{ this.state.detail.caseCloseDate ? moment(this.state.detail.caseCloseDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                    <Descriptions.Item label="结案员编号">{ this.state.detail.caseCloseOper }</Descriptions.Item>
                    <Descriptions.Item label="医疗费总额">{ this.state.detail.balanceMoney }</Descriptions.Item>
                    <Descriptions.Item label="经其他报销金额">{ this.state.detail.otherPayMoney }</Descriptions.Item>
                    <Descriptions.Item label="赔付金额">{ this.state.detail.insurancePay }</Descriptions.Item>
                    <Descriptions.Item label="拒赔原因">{ this.state.detail.adjReasonCodeName }</Descriptions.Item>
                    <Descriptions.Item label="是否重开赔案">{ this.state.detail.isRenewCase === '0' && '否' }{ this.state.detail.isRenewCase === '1' && '是' }</Descriptions.Item>
                    <Descriptions.Item label="重开赔案操作员">{ this.state.detail.renewCaseOper }</Descriptions.Item>
                    <Descriptions.Item label="重开赔案时间">{ this.state.detail.renewCaseDate ? moment(this.state.detail.renewCaseDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                    <Descriptions.Item label="重开赔案原因">{ this.state.detail.renewCaseReason }</Descriptions.Item>
                </Descriptions>
                <Divider />
                <Descriptions size="small" style={{ padding: '0 20px', marginBottom: 20 }}>
                    <Descriptions.Item label="报案号">{ this.state.detail.reportNo }</Descriptions.Item>
                    <Descriptions.Item label="报案人姓名">{ this.state.detail.applyName }</Descriptions.Item>
                    <Descriptions.Item label="出险经过">{ this.state.detail.accidentDescribe }</Descriptions.Item>
                    <Descriptions.Item label="报案人联系电话">{ this.state.detail.applyTelephone }</Descriptions.Item>
                    <Descriptions.Item label="报案人与被保险人关系">{ this.state.detail.applyRelationshipName }</Descriptions.Item>
                    <Descriptions.Item label="联系人姓名">{ this.state.detail.contactName }</Descriptions.Item>
                    <Descriptions.Item label="联系人电话">{ this.state.detail.contactTel }</Descriptions.Item>
                    <Descriptions.Item label="出险地点">{ this.state.detail.damageAddress }</Descriptions.Item>
                    <Descriptions.Item label="报案注销人编码">{ this.state.detail.reportCancelOper }</Descriptions.Item>
                    <Descriptions.Item label="报案注销时间">{ this.state.detail.reportCancelDate ? moment(this.state.detail.reportCancelDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                    <Descriptions.Item label="报案注销原因">{ this.state.detail.reportCancelReason }</Descriptions.Item>
                    <Descriptions.Item label="报案医院">{ this.state.detail.reportHospitalName }</Descriptions.Item>
                    <Descriptions.Item label="报案疾病">{ this.state.detail.reportDiseaseName }</Descriptions.Item>
                    <Descriptions.Item label="参保所在地市">{ this.state.detail.insuredCityName }</Descriptions.Item>
                    <Descriptions.Item label="是否罹患既往症">
                        { this.state.detail.previousDiseaseFlag === '1' && '是' }
                        { this.state.detail.previousDiseaseFlag === '0' && '否' }
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={3}>
                        { this.state.detail.remark }
                    </Descriptions.Item>
                    <Descriptions.Item label="受理说明" span={3}>
                        { this.state.detail.acceptRemark }
                    </Descriptions.Item>
                    <Descriptions.Item label="复审退回原因" span={3}>
                        { this.state.detail.secondReturnReasn }
                    </Descriptions.Item>
                </Descriptions>
                { this.renderQuestions() }
            </div>
        )
    }
    renderQuestions() {
        const columns = [
            { title: '报案号', dataIndex: 'reportNo', width: 200 },
            { title: '问题件', dataIndex: 'description' },
            { title: '是否已处理', dataIndex: 'isHandle', width: 100,
                render: text => <div>{ text === '1' && '是' }{ text === '0' && '否' }</div>
            }
        ]
        const props = {
            columns,
            rowKey: 'id',
            size: 'middle',
            dataSource: this.state.questionList,
            pagination: false,
            title: () => '问题件详情信息'
        }
        return <div style={{ padding: '0 20px'}}>
            <Table bordered className="list-table" {...props} />
        </div>
    }
    getQuestions = () => {
        if(!this.state.detail.reportNo){
            return
        }
        http.post('/rs/api/claim/problempiecs/queryProblemPiecs', { reportNo: this.state.detail.reportNo }).then(res => {
            this.setState({
                questionList: res
            })
        })
    }
}
export default AcceptInfo;