import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Modal, Tabs, Badge } from 'antd'
import moment from 'moment'
import http from '@/utils/http'

import icon from '@/project-rs/assets/images/icon/icon-dfsxxcx.png';

import FormSearch from './FormSearch'

import InsurancePolicyDetail from '@/project-rs/assets/component/InsurancePolicyDetail'
import AcceptInfo from '@/project-rs/assets/component/CaseInfo/acceptInfo'
import Attachments from '@/project-rs/assets/component/CaseInfo/attachments'
import FirstAudit from '@/project-rs/assets/component/CaseInfo/firstAudit'
import HistoryInvestigate from '@/project-rs/assets/component/CaseInfo/historyInvestigate'
import HistorySecondAudit from '@/project-rs/assets/component/CaseInfo/historySecondAudit'
import HistoryFinalAudit from '@/project-rs/assets/component/CaseInfo/historyFinalAudit'
import PolicyFee from '@/project-rs/assets/component/CaseInfo/policyFee'
import FeeList from '@/project-rs/assets/component/CaseInfo/feeList'
import CasePayeeInfo from '@/project-rs/assets/component/CaseInfo/casePayeeInfo'
import VisitInfo from '@/project-rs/assets/component/CaseInfo/visitInfo'

import VisitList from './VisitList'
import Audit from './Audit'

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            caseNum: 0,
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},
            insuranceCode: '',

            visible: false,
            tabKey: '0',
            caseId: '',
            policyId: '',
            caseDetail: {},

            curCase: {},
            visitVisible: false,
            auditCase: {},
            auditVisible: false
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.getList(1)
        this.getCaseNum()
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>业务操作</Breadcrumb.Item>
                    <Breadcrumb.Item>终审</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <Badge count={ this.state.caseNum }>
                                <img src={ icon } alt="" />
                            </Badge>
                            <span>案件信息查询</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        { this.renderList() }
                    </div>
                </div>
                { this.renderDetailModal() }
                <VisitList
                    visible={ this.state.visitVisible }
                    case={ this.state.curCase }
                    onClose={ this.closeVisit }
                />
                <Audit visible={ this.state.auditVisible } caseId={ this.state.auditCase.id }
                    policyId={ this.state.auditCase.policyId } onClose={ this.closeAudit } />
            </div>
        )
    }
    getCaseNum = () => {
        http.post('/rs/api/claim/queryCaseInfo/findCaseNum', {queryCaseNumFlag: '3'}).then(res => {
            this.setState({
                caseNum: res
            })
            setTimeout(() => {
                this.setState({
                    caseNum: 0
                })
            }, 3000)
        })
    }
    tabChange = key => {
        this.setState({
            tabKey: key
        })
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '报案号', dataIndex: 'reportNo', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center', width: '10%',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center', width: '8%',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center', width: '9%',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center', width: '8%',
                render: (text, r) => <span style={{ color: r.color }}>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '' }</span>
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center', width: '8%',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '险种', dataIndex: 'insuranceCode', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center', width: '8%',
                render: (text, r) => <span style={{ color: r.color }}>{ text ? moment(text).format('YYYY-MM-DD') : '' }</span>
            },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="就诊信息" onClick={this.showVisit.bind(this, record)}>
                            <span><Icon type="carry-out" /></span>
                        </Tooltip>
                        <Tooltip title="终审" onClick={this.showAudit.bind(this, record)}>
                            <span id="$button_final_case"><Icon type="audit" /></span>
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
            onChange: current=> {
                this.getList(current)
            }
        }
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    querySearch = data => {
        this.setState({
            searchData: data
        }, () => {
            this.getList(1)
        })
    }
    
    getList = current => {
        this.setState({
            currentPage: current,
            isLoading: true
        })
        let data = this.state.searchData
        data.currentPage = current
        data.pageSize = this.state.pageSize
        data.caseStateList = ['31']
        data.permissionFlag = '1'

        http.post('/rs/api/claim/queryCaseInfo/findCaseByCondition', data).then(res => {
            res.content.forEach(item => {
                if(item.isManager === '1' || item.isBusyFlag === '1' || item.isUp === '1' || item.isRedList === '1'){
                    item.color = '#f00'
                }
            })
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    renderDetailModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="案件详情"
                width="90%"
                centered
                visible={ this.state.visible }
                onCancel={ this.closeDetail }
                footer={ null }
            >
                <div className="modal-detail-content" id="detail" style={{ height: this.state.conHeight }}>
                    <Tabs activeKey={ this.state.tabKey } onChange={ this.tabChange } >
                        <TabPane tab="保单信息" key="0">
                            <InsurancePolicyDetail id={ this.state.policyId } />
                        </TabPane>
                        <TabPane tab="就诊信息" key="10">
                            <VisitInfo detail={ this.state.caseDetail.visitInfo ? this.state.caseDetail.visitInfo : {} } />
                        </TabPane>
                        <TabPane tab="理赔受理信息" key="1">
                            <AcceptInfo detail={ this.state.caseDetail.caseInfo } />
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
                                <FeeList list={ this.state.caseDetail.categoryDs ? this.state.caseDetail.categoryDs : [] } />
                            </TabPane>
                        }
                        <TabPane tab="案件领款人信息" key="9">
                            <CasePayeeInfo detail={ this.state.caseDetail.casePayeeInfoEntity ? this.state.caseDetail.casePayeeInfoEntity : {} } />
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
    detail = record => {
        this.setState({
            visible: true,
            policyId: record.policyId,
            tabKey: '0',
            caseDetail: {}
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
        this.setState({
            visible: false,
            policyId: ''
        })
    }

    showVisit = item => {
        this.setState({
            visitVisible: true,
            curCase: item
        })
    }
    closeVisit = () => {
        this.setState({
            visitVisible: false,
            curCase: {}
        })
    }

    showAudit = item => {
        this.setState({
            auditVisible: true,
            auditCase: item
        })
    }
    closeAudit = flag => {
        this.setState({
            auditVisible: false,
            auditCase: {}
        })

        if(flag === 'suc'){
            this.getList(1)
        }
    }
}
export default index