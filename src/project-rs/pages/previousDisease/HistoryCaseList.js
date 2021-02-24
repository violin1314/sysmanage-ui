import React, {Component} from 'react'
import { Table, Icon, Tooltip, Modal, Tabs } from 'antd';
import moment from 'moment'
import http from '@/utils/http'

import AcceptInfo from '@/project-rs/assets/component/CaseInfo/acceptInfo'
import Attachments from '@/project-rs/assets/component/CaseInfo/attachments'
import FirstAudit from '@/project-rs/assets/component/CaseInfo/firstAudit'
import HistoryInvestigate from '@/project-rs/assets/component/CaseInfo/historyInvestigate'
import HistorySecondAudit from '@/project-rs/assets/component/CaseInfo/historySecondAudit'
import HistoryFinalAudit from '@/project-rs/assets/component/CaseInfo/historyFinalAudit'
import PolicyFee from '@/project-rs/assets/component/CaseInfo/policyFee'
import FeeList from '@/project-rs/assets/component/CaseInfo/feeList'
import CasePayeeInfo from '@/project-rs/assets/component/CaseInfo/casePayeeInfo'
import CaseVisitInfo from '@/project-rs/assets/component/CaseInfo/visitInfo'
import VisitInfo from '@/project-rs/assets/component/VisitInfo'
import QuestionInfo from '@/project-rs/assets/component/QuestionInfo'
//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

class HistoryCaseList extends Component {
    constructor(props){
        super(props)
        this.state = {
            curPolicyId: '',

            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},
            insuranceCode: '',

            visible: false,
            caseDetail: {},
            tabKey: '1',

            curCase: {},
            curVisit: {},
            visitVisible: false,
            expandedRowKeys: [],
            visitLoading: false,

            questionVisible: false
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.setState({
            curPolicyId: this.props.policyId
        }, () => {
            this.getList(1)
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(this.props.policyId === nextProps.policyId){
            return
        }
        this.setState({
            curPolicyId: nextProps.policyId,
            listObj: {}
        }, () => {
            this.getList(1)
        })
    }
    render(){
        const TabPane = Tabs.TabPane;
        return (
            <div> 
                { this.renderList() }
                <Modal
                    className="modal-detail"
                    title="案件详情"
                    width="80%"
                    centered
                    visible={ this.state.visible }
                    onCancel={ this.closeDetail }
                    footer={ null }
                >
                    <div className="modal-detail-content" id="detail" style={{ height: this.state.conHeight }}>
                        <Tabs activeKey={ this.state.tabKey } onChange={ this.tabChange } >
                            <TabPane tab="理赔受理信息" key="1">
                                <AcceptInfo detail={ this.state.caseDetail.caseInfo ? this.state.caseDetail.caseInfo : {} } />
                            </TabPane>
                            <TabPane tab="就诊信息" key="10">
                                <CaseVisitInfo detail={ this.state.caseDetail.visitInfo ? this.state.caseDetail.visitInfo : {} } />
                            </TabPane>
                            <TabPane tab="影像信息" key="2">
                                <Attachments list={ this.state.caseDetail.caseAttachmentDs ? this.state.caseDetail.caseAttachmentDs : [] } />
                            </TabPane>
                            <TabPane tab="系统初审信息" key="3">
                                <FirstAudit detail={ this.state.caseDetail.caseSysFirstAuditInfoDs ? this.state.caseDetail.caseSysFirstAuditInfoDs : [] } />
                            </TabPane>
                            <TabPane tab="既往稽核" key="4">
                                <HistoryInvestigate list={ this.state.caseDetail.caseInvestigationInfoDs ? this.state.caseDetail.caseInvestigationInfoDs : [] } />
                            </TabPane>
                            <TabPane tab="既往复审" key="5">
                                <HistorySecondAudit list={ this.state.caseDetail.caseArtificialSecondAuditInfoDs ? this.state.caseDetail.caseArtificialSecondAuditInfoDs : [] } />
                            </TabPane>
                            <TabPane tab="既往系统终审" key="6">
                                <HistoryFinalAudit list={ this.state.caseDetail.caseFinalAuditingInfoEntityDs ? this.state.caseDetail.caseFinalAuditingInfoEntityDs : [] } />
                            </TabPane>
                            <TabPane tab="赔付信息" key="7">
                                <PolicyFee list={ this.state.caseDetail.policyfeeInfoDs ? this.state.caseDetail.policyfeeInfoDs : [] } />
                            </TabPane>
                            {
                                OTHERCODES.indexOf(this.state.insuranceCode) !== -1 &&
                                <TabPane tab="费用信息" key="8">
                                    <FeeList
                                        list={ this.state.caseDetail.categoryDs ? this.state.caseDetail.categoryDs : [] }
                                        isExport={ true }
                                        curCase={ this.state.curCase }
                                    />
                                </TabPane>
                            }
                            <TabPane tab="案件领款人信息" key="9">
                                <CasePayeeInfo detail={ this.state.caseDetail.casePayeeInfoEntity ? this.state.caseDetail.casePayeeInfoEntity : {} } />
                            </TabPane>
                        </Tabs>
                    </div>
                </Modal>
                <Modal
                    className="modal-detail"
                    title="就诊详情"
                    width="80%"
                    centered
                    visible={ this.state.visitVisible }
                    onCancel={ this.closeVisitDetail }
                    footer={ null }
                >
                    <div className="modal-detail-content" id="visitDetail" style={{ height: this.state.conHeight }}>
                        <VisitInfo visit={ this.state.curVisit } policyId={ this.state.curPolicyId } />
                    </div>
                </Modal>
                <Modal
                    className="modal-detail"
                    title="疑点详情"
                    width="80%"
                    centered
                    visible={ this.state.questionVisible }
                    onCancel={ this.closeQuestionInfo }
                    footer={ null }
                >
                    <div className="modal-detail-content" id="questionInfo" style={{ height: this.state.conHeight }}>
                        <QuestionInfo visit={ this.state.curVisit } case={ this.state.curCase } readOnly={ true } />
                    </div>
                </Modal>
            </div>
        )
    }
    tabChange = key => {
        this.setState({
            tabKey: key
        })
    }
    renderList(){
        const columns = [
            { title: '赔案号', dataIndex: 'indemnityCaseNo', align: 'center'},
            { title: '报案号', dataIndex: 'reportNo', align: 'center' },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center' },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center', render: text => text ? moment(text).format('YYYY-MM-DD') : '' },
            { title: '出险原因', dataIndex: 'accidentReasonName', align: 'center' },
            { title: '报案方式', dataIndex: 'reporterChannelName', align: 'center' },
            { title: '受理时间', dataIndex: 'reporterDate', align: 'center', render: text => text ? moment(text).format('YYYY-MM-DD') : '' },
            { title: '是否既往症', dataIndex: 'previousDiseaseFlag', align: 'center', render: text => text === '1' ? '是' : '否' },
            { title: '操作', key: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        let pagination = {
            total: this.state.listObj.totalElements,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: current => {
                this.getList(current)
            }
        }
        const props = {
            rowKey: 'id',
            columns: columns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination,
            expandedRowRender: this.expandedTable,
            expandedRowKeys: this.state.expandedRowKeys,
            onExpand : this.getVisitInfoList
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    expandedTable = () => {
        const columns = [
            {title: '入院日期', dataIndex: 'inHosDate'},
            {title: '出院日期', dataIndex: 'outHosDate'},
            {title: '医院编号', dataIndex: 'medicalOrganizationCode'},
            {title: '医院名称', dataIndex: 'medicalOrganizationName'},
            {title: '出院主诊断',dataIndex: 'outhosDiagnose'},
            {title: '入院科室', dataIndex: 'inhosDepartment'},
            {title: '住院天数', dataIndex: 'inDays'},
            {title: '医疗总费用', dataIndex: 'medicalTotalMoney'},
            {title: '经其他报销金额', dataIndex: 'otherPayMoney'},
            { title: '操作', key: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        {
                            record.relevanceType === '02' ?
                            <Tooltip title="就诊详情" onClick={this.detailVisit.bind(this, record)}>
                                <span><Icon type="carry-out" style={{ fontSize: 14 }} /></span>
                            </Tooltip> : ''
                        }
                        <Tooltip title="疑点详情" onClick={this.detailQuestion.bind(this, record)}>
                            <span><Icon type="question-circle" style={{ fontSize: 14 }} /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        const props = {
            rowKey: 'id',
            columns: columns,
            dataSource: this.state.visitInfoList,
            loading: this.state.visitLoading,
            pagination: false
        }
        return(
            <div style={{ padding: 2 }}>
                <Table className="list-table list-table-small" {...props} />
            </div>
        )
    }

    getList = current => {
        if(!this.state.curPolicyId){
            return
        }
        this.setState({
            currentPage: current,
            isLoading: true
        })
        let data = {
            currentPage: current,
            pageSize: this.state.pageSize,
            policyId: this.state.curPolicyId
        }
        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoByPolicyId', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    getVisitInfoList = (expanded, record) => {
        if(!expanded){
            this.setState({
                expandedRowKeys: []
            })
            return
        }
        this.setState({
            expandedRowKeys: [record.id],
            curCase: record,
            visitLoading: true
        })
        http.post('/rs/api/claim/queryVisitInfo/findVisitInfoByCaseId', { id: record.id }).then(res => {
            this.setState({
                visitInfoList: res,
                visitLoading: false
            })
        })
    }
    detail = record => {
        this.setState({
            visible: true,
            tabKey: '1',
            caseDetail: {},
            curCase: record
        })
        let data = {
            id: record.id,
            policyId: record.policyId,
            queryAttachmentFlag: true,
            queryFinalAuditFlag: true,
            queryInvestFlag: true,
            querySecondAuditFlag: true,
            querySysFirstAuditFlag: true,
            queryPolicyFeeFlag: true,
            queryFeeFlag: true,
            queryVisitFlag: true,
            queryCasePayeeFlag: true
        }
        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data, { isLoading: true }).then(res => {
            this.setState({
                caseDetail: res,
                insuranceCode: res.caseInfo.insuranceCode
            })
        })
    }
    closeDetail = () => {
        if(document.querySelector('#detail')){
            document.querySelector('#detail').scrollTop = 0
        }
        this.setState({
            visible: false,
            caseDetail: {},
            curCase: {}
        })
    }

    detailVisit = record => {
        this.setState({
            curVisit: record,
            visitVisible: true
        })
    }
    closeVisitDetail = () => {
        if(document.querySelector('#visitDetail')){
            document.querySelector('#visitDetail').scrollTop = 0
        }
        this.setState({
            curVisit: {},
            visitVisible: false
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
export default HistoryCaseList