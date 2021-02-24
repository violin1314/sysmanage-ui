import React, { Component } from 'react';
import { Table, Tabs, Spin, Form, Input, Button } from 'antd';
import http from '@/utils/http';

import DiagnosisList from './DiagnosisList'
import AllPayment from './AllPayment'
import ElectronicMedical from './ElectronicMedical'
import SiPayDetail from './SiPayDetail'
// import AllPaymentCount from './AllPaymentCount'

class VisitInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visitTabKey: '1',
            tabKey: '1',
            visitInfoId: '',
            policyId: '',

            isLoading: false,
            listLoading: false,
            currentPage: 1,
            list: [],
            listCache: [],
            selectedKeys: [],
            selectedRows: [],
            curVisit: {},

            diagnosis: [],
            payment: [],
            medical: {},
            siPayInfo: {},
            paymentCount: [],

            diagnose: ''
        }
    }
    componentDidMount() {
        this.init(this.props)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(this.props.policyId === nextProps.policyId){
            return
        }
        this.init(nextProps)
    }
    init(props){
        this.setState({
            tabKey: '1',
            visitTabKey: '1',
            visitInfoId: props.visit.id,
            policyId: props.policyId,
            list: []
        }, () => {
            if(!this.state.visitInfoId){
                return
            }
            this.getList()
        })
    }
    render() {
        const TabPane = Tabs.TabPane;
        return (
            <div>
                <Tabs activeKey={ this.state.visitTabKey } type="card" onChange={ this.changeVisitTab }>
                    <TabPane tab="当前就诊信息" key="1"></TabPane>
                    <TabPane tab="历史就诊信息" key="2"></TabPane>
                </Tabs>
                <Form layout="inline" style={{ marginBottom: 10 }}>
                    <Form.Item label="出院诊断">
                        <Input value={ this.state.diagnose } placeholder="请输入出院诊断" autoComplete="off" onChange={ this.changeInput } />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={ this.querySearch }>查询</Button>
                        <Button style={{ marginLeft: 10 }} onClick={ this.reset }>重置</Button>
                    </Form.Item>
                </Form>
                { this.renderTable() }
                <Tabs activeKey={ this.state.tabKey } type="card" onChange={ this.tabChange } >
                    <TabPane tab="付费方诊断信息" key="1">
                        <Spin spinning={ this.state.isLoading }>
                            <DiagnosisList list={ this.state.diagnosis } />
                        </Spin>
                    </TabPane>
                    <TabPane tab="费用明细信息" key="2">
                        <Spin spinning={ this.state.isLoading }>
                            <AllPayment payment={ this.state.payment } />
                        </Spin>
                    </TabPane>
                    <TabPane tab="电子病历信息" key="3">
                        <Spin spinning={ this.state.isLoading }>
                            <ElectronicMedical detail={ this.state.medical } />
                        </Spin>
                    </TabPane>
                    <TabPane tab="结算信息" key="4">
                        <Spin spinning={ this.state.isLoading }>
                            <SiPayDetail detail={ this.state.siPayInfo } />
                        </Spin>
                    </TabPane>
                    {/* <TabPane tab="费用明细信息汇总" key="5">
                        <Spin spinning={ this.state.isLoading }>
                            <AllPaymentCount paymentCount={ this.state.paymentCount } />
                        </Spin>
                    </TabPane> */}
                </Tabs>
            </div>
        )
    }
    renderTable(){
        const columns = [
            { title: '姓名', dataIndex: 'patientName', align: 'center', width: 80 },
            { title: '入院日期', dataIndex: 'inHosDate', align: 'center' },
            { title: '出院日期', dataIndex: 'outHosDate', align: 'center' },
            { title: '就诊医院名称', dataIndex: 'medicalOrganizationName', align: 'center' },
            { title: '出院诊断', dataIndex: 'outhosDiagnose', align: 'center' },
            { title: '入院科室', dataIndex: 'inhosDepartment', align: 'center' },
            { title: '医疗大类', dataIndex: 'medTypeName', align: 'center' },
            { title: '医疗总费用', dataIndex: 'medicalTotalMoney', align: 'center' }
        ]
        let pagination = {
            total: this.state.list.length,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: current => {
                this.setState({
                    currentPage: current
                })
            }
        }
        const props = {
            rowKey: 'visitNo',
            columns,
            size: 'middle',
            dataSource: this.state.list,
            loading: this.state.listLoading,
            pagination,
            rowSelection: {
                type: 'radio',
                columnWidth: 50,
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        tabKey: '1',
                        selectedKeys: keys,
                        curVisit: {
                            controlAreaCode: rows[0].controlAreaCode,
                            insuredIdCode: rows[0].patientId,
                            insuredName: rows[0].patientName,
                            medicalOrganizationCode: rows[0].medicalOrganizationCode,
                            visitNo: rows[0].visitNo
                        }
                    }, () => {
                        this.getDiagnosis()
                    })
                }
            }
        }
        return (
            <Table bordered className="list-table" {...props} />
        )
    }
    changeVisitTab = key => {
        this.setState({
            visitTabKey: key,

        }, () => {
            this.getList()
        })
    }
    
    getList = () => {
        this.setState({
            listLoading: true,
            diagnosis: [],
            diagnose: undefined,
            tabKey: '1'
        })
        let data = {}
        let url = ''
        if(this.state.visitTabKey === '1'){
            url = '/rs/api/claim/caseinfo/queryCaseInfoByBdasForSecond'
            data = { visitInfoId: this.state.visitInfoId }
        }else {
            url = '/rs/api/claim/caseinfo/queryCaseInfoByBdas'
            
            data.insurancePolicyInfoEntity = {
                id: this.state.policyId
            }
            
        }
        http.post(url, data).then(res => {
            this.setState({
                list: res,
                listCache: res,
                listLoading: false
            })
            if(res.length > 0){
                this.setState({
                    selectedKeys: [res[0].visitNo],
                    curVisit: {
                        controlAreaCode: res[0].controlAreaCode,
                        insuredIdCode: res[0].patientId,
                        insuredName: res[0].patientName,
                        medicalOrganizationCode: res[0].medicalOrganizationCode,
                        visitNo: res[0].visitNo
                    }
                }, () => {
                    this.getDiagnosis()
                })
            }
        })
    }
    changeInput = e => {
        this.setState({
            diagnose: e.target.value
        })
    }
    querySearch = () => {
        console.log(11)
        let listCache = JSON.parse(JSON.stringify(this.state.listCache));
        if(this.state.diagnose){
            listCache = listCache.filter(item => item.outhosDiagnose.indexOf(this.state.diagnose) !== -1)
        }
        this.setState({
            list: listCache
        })
    }
    reset = () => {
        let listCache = JSON.parse(JSON.stringify(this.state.listCache));
        this.setState({
            list: listCache,
            diagnose: undefined
        })
    }
    tabChange = key => {
        this.setState({
            tabKey: key
        })
        if(key === '1'){
            this.getDiagnosis()
        }
        if(key === '2'){
            this.getAllPayment()
        }
        if(key === '3'){
            this.getElectronicMedical()
        }
        if(key === '4'){
            this.getSiPayInfo()
        }
        if(key === '5'){
            this.getAllPaymentCount()
        }
    }
    getDiagnosis = () => {
        this.setState({
            isLoading: true,
            diagnosis: []
        })
        http.post('/rs/api/claim/bdas/findDiagnoseinps', this.state.curVisit).then(res => {
            this.setState({
                diagnosis: res,
                isLoading: false
            })
        })
    }
    getAllPayment = () => {
        this.setState({
            isLoading: true,
            payment: []
        })
        http.post('/rs/api/claim/bdas/findAllPayment', this.state.curVisit).then(res => {
            this.setState({
                payment: res,
                isLoading: false
            })
        })
    }
    getElectronicMedical = () => {
        this.setState({
            isLoading: true
        })
        http.post('/rs/api/claim/bdas/findAllEmrInfo', this.state.curVisit).then(res => {
            this.setState({
                medical: res,
                isLoading: false
            })
        })
    }
    getSiPayInfo = () => {
        this.setState({
            isLoading: true
        })
        http.post('/rs/api/claim/bdas/findSiPayInfo', this.state.curVisit).then(res => {
            this.setState({
                siPayInfo: res,
                isLoading: false
            })
        })
    }
    getAllPaymentCount = () => {
        this.setState({
            isLoading: true
        })
        let data = this.state.curVisit
        data.id = this.state.visitInfoId
        http.post('/rs/api/claim/bdas/findAllPaymentCount', data).then(res => {
            this.setState({
                paymentCount: res,
                isLoading: false
            })
        })
    }
}
VisitInfo = Form.create()(VisitInfo)
export default VisitInfo;