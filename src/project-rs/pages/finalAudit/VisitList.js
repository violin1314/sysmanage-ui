import React, { Component } from 'react';
import { Table, Tooltip, Icon, Modal } from 'antd';

import http from '@/utils/http'
import utils from '@/utils'

import VisitInfo from '@/project-rs/assets/component/VisitInfo'
import QuestionInfo from '@/project-rs/assets/component/QuestionInfo'

class VisitList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            conHeight: '',

            curCase: {},
            visitInfo: {},
            isLoading: false,

            curVisit: {},
            detailVisible: false,
            detailLoading: false,

            questionVisible: false
        }
    }
    componentDidMount() {
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.setState({
            curCase: this.props.case,
            visible: this.props.visible
        }, () => {
            this.getList()
        })

        utils.getCodeList(['report_cancel_reason'], res => {
            this.setState({
                reportCancelReasons: res[0].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(this.props.case.id === nextProps.case.id){
            return
        }
        this.setState({
            curCase: nextProps.case,
            visible: nextProps.visible
        }, () => {
            this.getList()
        })
    }
    render() {
        const coulmns = [
            { title: '入院日期', dataIndex: 'inHosDate', align: 'center' },
            { title: '出院日期', dataIndex: 'outHosDate', align: 'center' },
            { title: '医疗大类', dataIndex: 'medTypeName', align: 'center' },
            { title: '医院名称', dataIndex: 'medicalOrganizationName', align: 'center' },
            { title: '出院主诊断',dataIndex: 'outhosDiagnose', align: 'center' },
            { title: '入院科室', dataIndex: 'inhosDepartment', align: 'center' },
            { title: '医疗总费用', dataIndex: 'medicalTotalMoney', align: 'center' },
            { title: '乙类自理', dataIndex: 'partSelfAmnt', align: 'center' },
            { title: '自费', dataIndex: 'selfAmnt', align: 'center' },
            { title: '社保支付金额', dataIndex: 'siCost', align: 'center' },
            { title: '经其他报销金额', dataIndex: 'otherPayMoney', align: 'center' },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        {
                            record.relevanceType === '02' &&
                            <Tooltip title="详情" onClick={ this.detail.bind(this, record) }>
                                <span><Icon type="profile" /></span>
                            </Tooltip>
                        }
                        <Tooltip title="疑点管理" onClick={ this.detailQuestion.bind(this, record) }>
                            <span><Icon type="question-circle" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: [this.state.visitInfo],
            loading: this.state.isLoading,
            pagination: false
        }
        return (
            <div>
                <Modal
                    className="modal-detail"
                    title="就诊信息"
                    width="90%"
                    centered
                    visible={ this.state.visible }
                    onCancel={ this.close }
                    footer={ null }
                >
                    <div style={{ padding: '20px 20px 80px' }}>
                        <Table bordered className="list-table" {...props} />
                    </div>
                </Modal>

                <Modal
                    className="modal-detail"
                    title="就诊详情"
                    width="80%"
                    centered
                    visible={ this.state.detailVisible }
                    onCancel={ this.closeDetail }
                    footer={ null }
                >
                    <div className="modal-detail-content" id="visitDetail" style={{ height: this.state.conHeight }}>
                        <VisitInfo visit={ this.state.curVisit } policyId={ this.state.curCase.policyId } />
                    </div>
                </Modal>
                <Modal
                    className="modal-detail"
                    title="疑点详情"
                    width="90%"
                    centered
                    visible={ this.state.questionVisible }
                    onCancel={ this.closeQuestionInfo }
                    footer={ null }
                >
                    <div className="modal-detail-content" id="questionInfo" style={{ height: this.state.conHeight }}>
                        <QuestionInfo case={ this.state.curCase } visit={ this.state.curVisit } readOnly={ true } />
                    </div>
                </Modal>
            </div>
        )
    }
    getList = () => {
        if(!this.state.visible){
            return
        }
        let data = {
            id: this.state.curCase.id,
            policyId: this.state.curCase.policyId,
            queryVisitFlag: true
        }
        this.setState({
            isLoading: true,
            visitInfo: {id: '0'}
        })
        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data).then(res => {
            this.setState({
                visitInfo: res.visitInfo.id ? res.visitInfo : {},
                isLoading: false
            })
        })
    }
    close = () => {
        this.props.onClose()
    }
    

    detail = record => {
        this.setState({
            curVisit: record,
            detailVisible: true
        })
    }
    closeDetail = () => {
        if(document.querySelector('#visitDetail')){
            document.querySelector('#visitDetail').scrollTop = 0
        }
        this.setState({
            curVisit: {},
            detailVisible: false
        })
    }

    detailQuestion = record => {
        this.setState({
            curVisit: record,
            questionVisible: true
        })
    }
    closeQuestionInfo = () => {
        if(document.querySelector('#questionInfo')){
            document.querySelector('#questionInfo').scrollTop = 0
        }
        this.setState({
            curVisit: {},
            questionVisible: false
        })
    }
}
export default VisitList