import React, { Component } from 'react';
import { Form, Row, Col, Table, Button, Input, Select, Spin, Descriptions, Divider, message, Modal, Tooltip, Icon, Tabs } from 'antd';
import moment from 'moment'
import http from '@/utils/http'
import utils from '@/utils'
import '@/project-rs/assets/sass/pages/insuranceAccept.scss'
import PrescriptionCreate from './PrescriptionCreate'
import CalcMoney from './CalcMoney'
import FixedImgs from './other/FixedImgs';

import BDASData from './other/BDASData'
import PrescriptionInputList from './other/PrescriptionInputList'

import InputForm from './ApplyInputForm'

const { confirm } = Modal

class ApplyInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            case: {},
            isLoading: false,
            caseInfo: {},
            insurancePolicyInfoEntity: {},
            visitInfo: {},
            visitList: [],
            relevanceType: '',

            reporterChannels: [],
            medTypes: [],
            dutyRanges: [],
            reportCancelReasons: [],

            duty_range: [],
            prescriptionVisible: false,
            prescriptionList: [],

            calcVisible: false,
            calcList: [],
            calcListCache: [],

            reasonVisible: false,
            cancelReason: undefined,

            bookStr: '',
            isReQuery: false,
            bdasVisible: false,
            acceptRemark: '',
            partSelfAmnt: 0,
            selfAmnt: 0,
            moneyTotal: 0,
            curVisit: {},
            formFlag: '',
            inputVisitList: [],
            formVisible: false,
            visitTotalData: {},
            billNoList: []
        }
    }
    componentDidMount() {
        this.setState({
            case: this.props.case
        }, () => {
            this.getDetail()
        })
        utils.getCodeList(['reporter_channel', 'med_type', 'duty_range', 'report_cancel_reason'], res => {
            this.setState({
                reporterChannels: res[0].value,
                medTypes: res[1].value,
                dutyRanges: res[2].value,
                reportCancelReasons: res[3].value
            })
        })
        sessionStorage.setItem('insuredCityCode', '210100')
        sessionStorage.setItem('insuranceCode', '')
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.case.id || nextProps.case.id === this.props.case.id){
            return
        }
        this.props.form.resetFields()
        this.setState({
            case: nextProps.case,
            calcList: [],
            prescriptionList: [],
            bookStr: '',
            isLoading: false,
            isReQuery: false
        }, () => {
            this.getDetail()
        })
    }
    render() {
        return (
            <Spin spinning={ this.state.isLoading }>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <Button type="primary" size="small" onClick={ this.cancel }>返回</Button>
                        </div>
                    </div>
                    <div className="card-body">
                        <FixedImgs id={ this.state.case.id } />
                        <div style={{ padding: '0 20px 15px'}}>
                            <Descriptions size="small" style={{ paddingTop: 15 }}>
                                <Descriptions.Item label="个人保单号">
                                    { this.state.insurancePolicyInfoEntity.policyNo }
                                </Descriptions.Item>
                                <Descriptions.Item label="险种产品名称">
                                    { this.state.insurancePolicyInfoEntity.insuranceName }
                                </Descriptions.Item>
                                <Descriptions.Item label="被保险人姓名">
                                    { this.state.insurancePolicyInfoEntity.insuredName }
                                </Descriptions.Item>
                                <Descriptions.Item label="被保险人证件号">
                                    { this.state.insurancePolicyInfoEntity.idCode }
                                </Descriptions.Item>
                                <Descriptions.Item label="保单开始时间">
                                    { this.state.insurancePolicyInfoEntity.startDate }
                                </Descriptions.Item>
                                <Descriptions.Item label="保单结束时间">
                                    { this.state.insurancePolicyInfoEntity.endDate }
                                </Descriptions.Item>
                            </Descriptions>
                            <Divider />
                            <Descriptions size="small" style={{ paddingTop: 15 }}>
                                <Descriptions.Item label="报案方式">
                                    { this.state.caseInfo.reporterChannelName }
                                </Descriptions.Item>
                                <Descriptions.Item label="报案人姓名">
                                    { this.state.caseInfo.applyName }
                                </Descriptions.Item>
                                <Descriptions.Item label="报案人电话">
                                    { this.state.caseInfo.applyTelephone }
                                </Descriptions.Item>
                                <Descriptions.Item label="联系人姓名">
                                    { this.state.caseInfo.contactName }
                                </Descriptions.Item>
                                <Descriptions.Item label="联系人电话">
                                    { this.state.caseInfo.contactTel }
                                </Descriptions.Item>
                                <Descriptions.Item label="出险日期">
                                    { this.state.caseInfo.accidentDate ? moment(this.state.caseInfo.accidentDate).format('YYYY-MM-DD') : '' }
                                </Descriptions.Item>
                                <Descriptions.Item label="出险地点">
                                    { this.state.caseInfo.damageAddress }
                                </Descriptions.Item>
                                <Descriptions.Item label="出险原因">
                                    { this.state.caseInfo.accidentReasonName }
                                </Descriptions.Item>
                                <Descriptions.Item label="出险经过">
                                    { this.state.caseInfo.accidentDescribe }
                                </Descriptions.Item>
                                <Descriptions.Item label="报案医院">
                                    { this.state.caseInfo.reportHospitalName }
                                </Descriptions.Item>
                                <Descriptions.Item label="报案疾病">
                                    { this.state.caseInfo.reportDiseaseName }
                                </Descriptions.Item>
                                <Descriptions.Item label="备注">
                                    { this.state.caseInfo.remark }
                                </Descriptions.Item>
                            </Descriptions>
                            <div style={{ display: 'table', width: '100%' }}>
                                <div style={{ display: 'table-cell', width: 72, color: '#262626' }}>受理说明：</div>
                                <div style={{ display: 'table-cell' }}>
                                    <Input.TextArea
                                        rows={2}
                                        size="small"
                                        style={{ display: 'block', width: '100%' }}
                                        value={ this.state.acceptRemark }
                                        onChange={ this.changeAcceptRemark }
                                    />
                                </div>
                            </div>
                            <Divider />
                        </div>
                        <div style={{ padding: '0 5px' }}>
                            <div className="visit-input">
                                {
                                    this.state.relevanceType === '01' || this.state.relevanceType === '02' ?
                                    <React.Fragment>
                                        <Tabs animated={false}>
                                            <Tabs.TabPane tab="录入就诊信息" key="1">
                                                <Row type="flex" justify="space-between" style={{ padding: '0 10px' }}>
                                                    <Button type="primary" id="$button_addVisit" size="small" onClick={ this.addVisit }>新增就诊</Button>
                                                    <Button type="primary" size="small" onClick={ this.createData }>生成数据</Button>
                                                </Row>
                                                { this.renderInputVisitList() }
                                                {
                                                    this.state.formVisible &&
                                                    <InputForm
                                                        curVisit={ this.state.curVisit }
                                                        onQuery={ this.queryForm }
                                                        onCancel={ this.cancelForm }
                                                    />
                                                }
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="就诊信息汇总" key="2">
                                                { this.renderVisitTotal() }
                                            </Tabs.TabPane>
                                        </Tabs>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <Row className="tit">
                                            <Col><strong>就诊信息</strong></Col>
                                        </Row>
                                        { this.renderVisitInfo() }
                                    </React.Fragment>
                                }
                                <PrescriptionInputList
                                    list={ this.state.prescriptionList }
                                    relevanceType={ this.state.relevanceType }
                                    moneyTotal={ this.state.moneyTotal }
                                    partSelfAmnt={ this.state.partSelfAmnt }
                                    selfAmnt={ this.state.selfAmnt }
                                    billNoList={ this.state.billNoList }
                                    onChange={ this.changePrescriptionList }
                                />

                                { this.renderCalcList() }
                                <div style={{ margin: 15, padding: 15, border: '1px solid #e8e8e8'}}>
                                    <Button type="primary" size="small" onClick={ this.calcBook }>生成计算书</Button>
                                    <div style={{ padding: 15, marginTop: 15, background: '#f1f1f1' }}>
                                        { this.state.bookStr ? this.state.bookStr : <p style={{ textAlign: 'center', padding: 20, color: '#999'}}>暂无计算书</p> }
                                    </div>
                                </div>
                            </div>
                            <Row style={{ textAlign: 'center', paddingBottom: 10 }}>
                                <Button type="primary" onClick={ this.giveUp } disabled={ this.state.isReQuery }>放弃</Button>
                                <Button type="primary" onClick={ this.onSubmit.bind(this, 2) } style={{ marginLeft: 20 }} disabled={ this.state.isReQuery }>暂存</Button>
                                <Button type="primary" onClick={ this.logOff } style={{ marginLeft: 20 }} disabled={ this.state.isReQuery }>报案注销</Button>
                                <Button type="primary" onClick={ this.onSubmit.bind(this, 1) } style={{ marginLeft: 20 }} disabled={ this.state.isReQuery }>立案</Button>
                                <Button type="primary" onClick={ this.reQuery } style={{ marginLeft: 20 }} disabled={ !this.state.isReQuery }>补传</Button>
                            </Row>
                        </div>
                        <Modal
                            title="录入处方信息"
                            width="600px"
                            visible={ this.state.prescriptionVisible }
                            onOk={ this.savePrescription }
                            onCancel={ this.cancelPrescription}
                            footer={ null }
                        >
                            <PrescriptionCreate visible={ this.state.prescriptionVisible } onQuery={ this.savePrescription } />
                        </Modal>
                        <Modal
                            title="理算"
                            width="90%"
                            visible={ this.state.calcVisible }
                            onOk={ this.saveCalc }
                            onCancel={ this.cancelCalc }
                            footer={ null }
                        >
                            <CalcMoney caseId={ this.state.case.id } policyId={ this.state.case.policyId } visible={ this.state.calcVisible } onQuery={ this.saveCalc } onCancel={ this.cancelCalc } />
                        </Modal>
                        <Modal
                            title="注销原因"
                            width="400px"
                            visible={ this.state.reasonVisible }
                            onOk={ this.queryOff }
                            onCancel={ this.closeReason }
                        >
                            <Form.Item>
                                <Select value={ this.state.cancelReason } placeholder="请选择注销原因" onChange={ this.changeReason } style={{ width: '100%' }}>
                                {
                                    this.state.reportCancelReasons.map(item => (
                                        <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option> 
                                    ))
                                }
                                </Select>
                            </Form.Item>
                        </Modal>
                        <BDASData
                            visible={ this.state.bdasVisible }
                            caseId={ this.state.case.id }
                            caseInfo={ this.state.caseInfo }
                            policy={ this.state.insurancePolicyInfoEntity }
                            onOk={ this.queryBdas }
                            onCancel={ this.cancelBadas }
                        />
                    </div>
                </div>
            </Spin>
        )
    }
    renderInputVisitList(){
        const columns = [
            { title: '入院日期', dataIndex: 'inHosDate', align: 'center', render: text => moment(text).format('YYYY-MM-DD') },
            { title: '出院日期', dataIndex: 'outHosDate', align: 'center', render: text => moment(text).format('YYYY-MM-DD') },
            { title: '就诊医院名称', dataIndex: 'medicalOrganizationName', align: 'center' },
            { title: '出院诊断', dataIndex: 'outhosDiagnose', align: 'center' },
            { title: '入院科室', dataIndex: 'inhosDepartment', align: 'center' },
            { title: '医疗大类', dataIndex: 'medTypeName', align: 'center' },
            { title: '医疗总费用', dataIndex: 'medicalTotalMoney', align: 'center' },
            { title: '乙类自理', dataIndex: 'partSelfAmnt', align: 'center' },
            { title: '自费', dataIndex: 'selfAmnt', align: 'center' },
            { title: '社保支付金额', dataIndex: 'siCost', align: 'center' },
            { title: '其他途径报销金额', dataIndex: 'otherPayMoney', align: 'center' },
            { title: '发票号', dataIndex: 'billNo', align: 'center' },
            { title: '操作', dataIndex: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="编辑" onClick={this.editVisit.bind(this, record)}>
                            <span><Icon type="file" /></span>
                        </Tooltip>
                        <Tooltip title="删除" onClick={this.delVisit.bind(this, record)}>
                            <span><Icon type="delete" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        const props = {
            rowKey: 'key',
            columns,
            size: 'middle',
            dataSource: this.state.inputVisitList,
            pagination: false,
            scroll: { x: 2000 },
            tableLayout: 'auto'
        }
        return(
            <Table bordered className="list-table" {...props} style={{ margin: 10 }} />
        )
    }
    queryForm = data => {
        let inputVisitList = JSON.parse(JSON.stringify(this.state.inputVisitList))
        if(this.state.formFlag === 'add'){
            data['relevanceType'] = '01'
            inputVisitList.push(data)
            inputVisitList.forEach((item, index) => {
                item.key = index + 1;
            })
        }else{
            let idx = ''
            inputVisitList.forEach((item, index) => {
                if(data.key === item.key){
                    idx = index
                    data['relevanceType'] = item.relevanceType
                }
            })

            inputVisitList.splice(idx, 1, data)
        }

        let billNo = ''
        inputVisitList.forEach(item => {
            billNo += item.billNo + '|'
        })
        let billNoList = billNo.split('|');
        billNoList = billNoList.filter(s => s && s.trim());

        let prescriptionList = this.state.prescriptionList;
        let prescriptionChange = false;
        prescriptionList.forEach((item, index) => {
            if(billNoList.indexOf(item.billNo) === -1){
                prescriptionChange = true
            }
        })
        prescriptionList = prescriptionList.filter(item => billNoList.indexOf(item.billNo) !== -1)
        
        this.setState({
            inputVisitList,
            formVisible: false,
            curVisit: {}
        }, () => {
            this.loadVisitTotal()

            if(prescriptionChange){
                this.changePrescriptionList(prescriptionList)
                this.setState({
                    prescriptionList
                })
            }
        })
    }
    loadVisitTotal = () => {
        let inputVisitList = JSON.parse(JSON.stringify(this.state.inputVisitList))
        let visitTotalData = inputVisitList.length > 0 ? inputVisitList[0] : {}
        delete visitTotalData.key

        let partSelfAmnt = 0
        let selfAmnt = 0
        let moneyTotal = 0
        let otherPayMoney = 0
        let siCost = 0
        let billNo = ''
        inputVisitList.forEach(item => {
            partSelfAmnt += item.partSelfAmnt ? Number(item.partSelfAmnt) : 0
            selfAmnt += item.selfAmnt ? Number(item.selfAmnt) : 0
            moneyTotal += item.medicalTotalMoney ? Number(item.medicalTotalMoney) : 0
            otherPayMoney += item.otherPayMoney ? Number(item.otherPayMoney) : 0
            siCost += item.siCost ? Number(item.siCost) : 0
            billNo += item.billNo + '|'
        })
        let billNoList = billNo.split('|');
        billNoList = billNoList.filter(s => s && s.trim());

        billNo = billNo.substring(0, billNo.length - 1);
        visitTotalData.billNo = billNo

        this.setState({
            partSelfAmnt: Number(partSelfAmnt.toFixed(2)),
            selfAmnt: Number(selfAmnt.toFixed(2)),
            billNoList
        })
        
        this.setState({
            visitTotalData: {
                medicalOrganizationCode: visitTotalData.medicalOrganizationCode,
                medicalOrganizationName: visitTotalData.medicalOrganizationName,
                outhosDiagnoseCode: visitTotalData.outhosDiagnoseCode,
                outhosDiagnose: visitTotalData.outhosDiagnose,
                inhosDepartment: visitTotalData.inhosDepartment,
                inHosDate: visitTotalData.inHosDate,
                outHosDate: visitTotalData.outHosDate,
                medicalTotalMoney: Number(moneyTotal.toFixed(2)),
                otherPayMoney: Number(otherPayMoney.toFixed(2)),
                medType: visitTotalData.medType,
                medTypeName: visitTotalData.medTypeName,
                siCost: Number(siCost.toFixed(2)),
                billNo: visitTotalData.billNo,
                isSelfVisit: visitTotalData.isSelfVisit,
                relevanceType: visitTotalData.relevanceType
            }
        })
    }
    addVisit = () => {
        this.setState({
            formVisible: true,
            curVisit: {},
            formFlag: 'add'
        })
    }
    editVisit = record => {
        this.setState({
            formVisible: true,
            curVisit: record,
            formFlag: 'edit'
        })
    }
    delVisit = record => {
        let inputVisitList = JSON.parse(JSON.stringify(this.state.inputVisitList))
        let idx = ''
        inputVisitList.forEach((item, index) => {
            if(item.key === record.key){
                idx = index
            }
        })
        inputVisitList.splice(idx, 1)

        let billNo = ''
        inputVisitList.forEach(item => {
            billNo += item.billNo + '|'
        })
        let billNoList = billNo.split('|');
        billNoList = billNoList.filter(s => s && s.trim());

        let prescriptionList = this.state.prescriptionList;
        let prescriptionChange = false;
        
        prescriptionList.forEach((item, index) => {
            if(billNoList.indexOf(item.billNo) === -1){
                prescriptionChange = true
            }
        })
        prescriptionList = prescriptionList.filter(item => billNoList.indexOf(item.billNo) !== -1)

        this.setState({
            inputVisitList
        }, () => {
            this.loadVisitTotal()
            if(prescriptionChange){
                this.changePrescriptionList(prescriptionList)
                this.setState({
                    prescriptionList
                })
            }
        })
    }
    cancelForm = () => {
        this.setState({
            formVisible: false,
            curVisit: {},
            formFlag: ''
        })
    }

    renderVisitTotal(){
        let inputVisitList = JSON.parse(JSON.stringify(this.state.inputVisitList))
        let visit = this.state.visitTotalData

        return (
            inputVisitList.length > 0 ?
            <Descriptions style={{ padding: '0 20px' }}>
                <Descriptions.Item label="医院名称">{ visit.medicalOrganizationName }</Descriptions.Item>
                <Descriptions.Item label="入院科室">{ visit.inhosDepartment }</Descriptions.Item>
                <Descriptions.Item label="入院日期">{ moment(visit.inHosDate).format('YYYY-MM-DD') }</Descriptions.Item>
                <Descriptions.Item label="出院日期">{ moment(visit.outHosDate).format('YYYY-MM-DD') }</Descriptions.Item>
                <Descriptions.Item label="医疗总费用">{ visit.medicalTotalMoney }</Descriptions.Item>
                <Descriptions.Item label="其他途径报销金额">{ visit.otherPayMoney }</Descriptions.Item>
                <Descriptions.Item label="出院诊断">{ visit.outhosDiagnose }</Descriptions.Item>
                <Descriptions.Item label="医疗大类">{ visit.medTypeName }</Descriptions.Item>
                <Descriptions.Item label="发票号">{ visit.billNo }</Descriptions.Item>
                <Descriptions.Item label="乙类自理金额">{ this.state.partSelfAmnt }</Descriptions.Item>
                <Descriptions.Item label="自费金额">{ this.state.selfAmnt }</Descriptions.Item>
                <Descriptions.Item label="社保支付金额">{ visit.siCost }</Descriptions.Item>
            </Descriptions> :
            <div style={{ textAlign: 'center', padding: 30, color: '#999' }}>暂无就诊信息</div>
        )
    }
    changePrescriptionList = list => {
        let partSelfAmnt = 0
        let selfAmnt = 0
        let moneyTotal = 0
        list.forEach(item => {
            partSelfAmnt += Number(item.partSelfAmnt)
            selfAmnt += Number(item.selfAmnt)
            moneyTotal += Number(item.money)
        })
        this.setState({
            prescriptionList: list,
            partSelfAmnt: Number(partSelfAmnt.toFixed(2)),
            selfAmnt: Number(selfAmnt.toFixed(2)),
            moneyTotal: Number(moneyTotal.toFixed(2)),
            calcList: [],
            bookStr: ''
        })

        // if(this.state.relevanceType === '02'){
        //     let visitInfo = JSON.parse(JSON.stringify(this.state.visitList[0]))
        //     visitInfo['partSelfAmnt'] = Number(partSelfAmnt.toFixed(2))
        //     visitInfo['selfAmnt'] = Number(selfAmnt.toFixed(2))
        //     this.setState({
        //         visitList: [visitInfo]
        //     })
        // }

        // if(this.state.relevanceType === '01'){
        let inputVisitList = JSON.parse(JSON.stringify(this.state.inputVisitList))
        inputVisitList.forEach(iv => {
            let partSelfAmnt = 0;
            let selfAmnt = 0;
            let array = iv.billNo.split('|')
            list.forEach(item => {
                if(array.indexOf(item.billNo) !== -1){
                    partSelfAmnt += Number(item.partSelfAmnt)
                    selfAmnt += Number(item.selfAmnt)
                }
            })
            iv['partSelfAmnt'] = Number(partSelfAmnt.toFixed(2))
            iv['selfAmnt'] = Number(selfAmnt.toFixed(2))
        })
        this.setState({
            inputVisitList
        }, () => {
            this.loadVisitTotal()
        })
        // }
    }

    createData = () => {
        this.setState({
            bdasVisible: true
        })
    }
    queryBdas = () => {
        this.setState({
            bdasVisible: false
        })
        this.getDetail()
    }
    cancelBadas = () => {
        this.setState({
            bdasVisible: false
        })
    }

    getDetail = () => {
        this.setState({
            isLoading: true,
            caseInfo: {},
            insurancePolicyInfoEntity: {},
            visitInfo: {}
        })
        let data = {
            id: this.state.case.id,
            queryVisitFlag: true,
            queryFeeFlag: true,
            queryPolicyFlag: true,
            queryPolicyFeeFlag: true,
            queryVisitDetailFlag: true
        }
        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data).then(res => {
            let prescriptionList = []
            let partSelfAmnt = 0
            let selfAmnt = 0
            let moneyTotal = 0

            sessionStorage.setItem('insuranceCode', res.caseInfo.insuranceCode)

            if(res.categoryDs){
                res.categoryDs.forEach((item, index) => {
                    prescriptionList.push({
                        key: index + 1,
                        projectCode: item.projectCode,
                        projectName: item.projectName,
                        price: item.price,
                        num: item.num,
                        money: item.money,
                        itemTypeYb: item.itemTypeYb,
                        feeProjectGrade: item.feeProjectGrade,
                        partSelfAmnt: item.partSelfAmnt,
                        selfAmnt: item.selfAmnt,
                        billNo: item.billNo,
                        isValid: '1'
                    })
                    partSelfAmnt += Number(item.partSelfAmnt)
                    selfAmnt += Number(item.selfAmnt)
                    moneyTotal += Number(item.money)
                })
            }
            let calcList = []
            if(res.policyfeeInfoDs){
                res.policyfeeInfoDs.forEach((item, index) => {
                    calcList.push({
                        key: index + 1,
                        dutyCode: item.payDutyCode,
                        payDutyName: item.payDutyName,
                        complianceFee: item.complianceFee,
                        franchiseTotal: item.franchiseTotal,
                        onePayProportion: item.onePayProportion,
                        punishmentPayProportion: item.punishmentPayProportion,
                        limitMoney: item.limitMoney,
                        insurancePay: item.insurancePay,
                        personDeductMoney: item.personDeductMoney,
                        otherDeductMoney: item.otherDeductMoney,
                        comFormula: item.comFormula,
                        franchise: item.franchise,
                        caseInfoId: item.caseInfoId
                    })
                })
            }
            let relevanceType = res.visitInfo ? res.visitInfo.relevanceType : '01'
            this.setState({
                isLoading: false,
                caseInfo: res.caseInfo,
                insurancePolicyInfoEntity: res.insurancePolicyInfoEntity,
                visitInfo: res.visitInfo ? res.visitInfo : {},
                visitList: res.visitInfo ? [res.visitInfo] : [],
                prescriptionList: prescriptionList,
                relevanceType: relevanceType,
                // duty_range: res.visitInfo && res.visitInfo.relevanceType === '02' ? res.visitInfo.dutyRange.split(',') : [],
                calcList: calcList,
                calcListCache: calcList,
                bookStr: res.caseInfo.comFormula,
                isReQuery: res.caseInfo.firstCheckFlag === '0',
                acceptRemark: res.caseInfo.acceptRemark,
                partSelfAmnt: Number(partSelfAmnt.toFixed(2)),
                selfAmnt: Number(selfAmnt.toFixed(2)),
                moneyTotal: Number(moneyTotal.toFixed(2)),
            })
            let billNo = ''
            res.visitDetailInfoEntityList.forEach((item, index) => {
                item.key = index + 1;
                billNo += item.billNo + '|'
            })
            let billNoList = billNo.split('|');
            billNoList = billNoList.filter(s => s && s.trim());

            if(res.visitInfo){
                this.setState({ 
                    partSelfAmnt: res.visitInfo.partSelfAmnt,
                    selfAmnt: res.visitInfo.selfAmnt,
                    siCostStr: res.visitInfo.selfComFormula,
                    inputVisitList: res.visitDetailInfoEntityList,
                    billNoList,
                    visitTotalData: {
                        medicalOrganizationCode: res.visitInfo.medicalOrganizationCode,
                        medicalOrganizationName: res.visitInfo.medicalOrganizationName,
                        outhosDiagnoseCode: res.visitInfo.outhosDiagnoseCode,
                        outhosDiagnose: res.visitInfo.outhosDiagnose,
                        inhosDepartment: res.visitInfo.inhosDepartment,
                        inHosDate: res.visitInfo.inHosDate,
                        outHosDate: res.visitInfo.outHosDate,
                        medicalTotalMoney: res.visitInfo.medicalTotalMoney,
                        otherPayMoney: res.visitInfo.otherPayMoney,
                        medType: res.visitInfo.medType,
                        medTypeName: res.visitInfo.medTypeName,
                        siCost: res.visitInfo.siCost,
                        billNo: res.visitInfo.billNo,
                        isSelfVisit: res.visitInfo.isSelfVisit,
                        relevanceType: relevanceType
                    }
                })
            }
            if(relevanceType !== '01'){
                this.setState({
                    inputVisitList: res.visitDetailInfoEntityList,
                    initMoneyTotal: res.visitInfo.medicalTotalMoney,
                    initBillNo: res.visitInfo.billNo
                })
            }
        })
    }
    onSubmit = flag => {
        if(this.state.inputVisitList.length === 0){
            message.error('请录入就诊信息')
            return
        }
        if(flag === 3){
            if(this.state.prescriptionList.length === 0){
                message.error('请先录入处方信息')
                return
            }
            let values = this.state.visitTotalData;
            
            if(this.state.relevanceType === '01' || this.state.relevanceType === '02'){
                let totalMoney = 0
                let medicalTotalMoney = values.medicalTotalMoney
                let selfAmntTotal = 0
                let partSelfAmntTotal = 0
                this.state.prescriptionList.forEach(item => {
                    totalMoney += Number(item.money)
                    selfAmntTotal += Number(item.selfAmnt)
                    partSelfAmntTotal += Number(item.partSelfAmnt)
                })
                
                if(Number(medicalTotalMoney) !== Number(totalMoney.toFixed(2))){
                    message.error('处方总金额不等于医疗总费用')
                    return
                }
                if(Number(Number(partSelfAmntTotal).toFixed(2)) !== Number(this.state.partSelfAmnt)){
                    message.error('处方乙类自理总金额不等于就诊中乙类自理金额')
                    return
                }
                if(Number(Number(selfAmntTotal).toFixed(2)) !== Number(this.state.selfAmnt)){
                    message.error('处方自费总金额不等于就诊中自费金额')
                    return
                }
            }

            http.post('/rs/api/claim/caseinfo/isExistNoEndCase', { id: this.state.case.id }, { isLoading: true }).then(res => {
                if(res){
                    this.showCalc(this.state.visitTotalData)
                }
            })
            return
        }
        this.apply(this.state.visitTotalData, flag)
    }
    cancel = () => {
        this.props.onClose()
    }
    giveUp = () => {
        confirm({
            title: '提示',
            content: '确定要放弃吗？',
            onOk: () => {
                let data = {
                    indemnityCaseId: this.state.case.id,
                    nodeCode: '04'
                }
                http.post('/rs/api/claim/caseinfo/giveUpCaseTask', data, { isLoading: true }).then(res => {
                    message.success('放弃成功')
                    this.props.onClose('suc')
                })
            }
        })
    }
    changeReason = v => {
        this.setState({
            cancelReason: v
        })
    }
    
    logOff = () => {
        this.setState({
            reasonVisible: true,
            cancelReason: undefined
        })
    }
    queryOff = () => {
        if(!this.state.cancelReason){
            message.error('请选择注销原因')
            return
        }
        let data = {
            id: this.state.case.id,
            reportCancelReason: this.state.cancelReason
        }
        http.post('/rs/api/claim/caseinfo/deleteCase', data, { isLoading: true }).then(res => {
            message.success('报案注销成功')
            this.closeReason()
            this.props.onClose('suc')
        })
    }
    closeReason = () => {
        this.setState({
            reasonVisible: false
        })
    }
    
    renderVisitInfo(){
        const coulmns = [
            { title: '姓名', dataIndex: 'patientName', align: 'center'},
            { title: '入院日期', dataIndex: 'inHosDate', align: 'center' },
            { title: '出院日期', dataIndex: 'outHosDate', align: 'center' },
            { title: '就诊医院等级', dataIndex: 'hospitalLevel', align: 'center' },
            { title: '就诊医院编号', dataIndex: 'medicalOrganizationCode', align: 'center' },
            { title: '就诊医院名称', dataIndex: 'medicalOrganizationName', align: 'center' },
            { title: '出院诊断', dataIndex: 'outhosDiagnose', align: 'center' },
            { title: '入院科室', dataIndex: 'inhosDepartment', align: 'center' },
            { title: '医疗总费用', dataIndex: 'medicalTotalMoney', align: 'center' },
            { title: '账户支出', dataIndex: 'accountCost', align: 'center' },
            { title: '现金支出', dataIndex: 'ownCost', align: 'center' },
            { title: '责任范围', dataIndex: 'dutyRange', align: 'center',
                render: (text, record) => (
                    <Select mode="multiple" size="small" style={{ width: 100 }} value={ this.state.duty_range } onChange={ this.changeDuty }>
                    {
                        this.state.dutyRanges.map(item => (
                            <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                        ))
                    }
                    </Select>
                )
            }
        ]
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.visitList,
            pagination: false
        }
        return(
            <Table bordered className="list-table" {...props} style={{ margin: 15 }} />
        )
    }
    changeDuty = v => {
        this.setState({
            duty_range: v
        })
    }
    showPrescription = () => {
        let medicalTotalMoney = this.props.form.getFieldValue('medicalTotalMoney')
        if(!medicalTotalMoney){
            message.error('请先录入医疗总费用')
            return
        }
        this.setState({
            prescriptionVisible: true
        })
    }
    savePrescription = data => {
        if(data === 'cancel'){
            this.cancelPrescription()
            return
        }
        let prescriptionList = JSON.parse(JSON.stringify(this.state.prescriptionList))
        prescriptionList.push(data)
        prescriptionList.forEach((item, index) => {
            item['index'] = index + 1
        })
        this.setState({
            prescriptionList,
            prescriptionVisible: false,
            calcList: [],
            bookStr: ''
        })
    }
    cancelPrescription = () => {
        this.setState({
            prescriptionVisible: false
        })
    }
    renderPrescriptionList(){
        const coulmns = [
            { title: '费用类别', dataIndex: 'itemTypeYbName', align: 'center'},
            { title: '费用金额', dataIndex: 'money', align: 'center' },
            { title: '社保已支付金额', dataIndex: 'securityAmnt', align: 'center' }
        ]
        if(this.state.relevanceType === '01' || this.state.relevanceType === '02'){
            coulmns.push({
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="删除" onClick={this.delPrescription.bind(this, record)}>
                            <span><Icon type="delete" /></span>
                        </Tooltip>
                    </div>
                )
            })
        }
        const props = {
            rowKey: 'index',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.prescriptionList,
            pagination: false,
            title: () => '处方信息'
        }
        return(
            <Table bordered className="list-table" {...props} style={{ margin: 15 }} />
        )
    }
    delPrescription = item => {
        let index = this.state.prescriptionList.indexOf(item);
        let prescriptionList = this.state.prescriptionList.slice();
        prescriptionList.splice(index, 1)
        this.setState({
            prescriptionList,
            calcList: [],
            bookStr: ''
        })
    }
    changeMoney = () => {
        this.setState({
            calcList: [],
            bookStr: ''
        })
    }
    showCalc = values => {
        let moneyData = values
        
        moneyData['selfAmnt'] = this.state.selfAmnt
        moneyData['partSelfAmnt'] = this.state.partSelfAmnt

        sessionStorage.setItem('moneyData', JSON.stringify(moneyData))

        this.setState({
            calcVisible: true
        })
    }
    cancelCalc = () => {
        this.setState({
            calcVisible: false
        })
    }
    saveCalc = list => {
        let calcListCache = []
        list.forEach(item => {
            calcListCache.push(item)
        })
        calcListCache.forEach((item, index) => {
            item['key'] = index + 1
        })
        this.setState({
            calcVisible: false,
            calcList: calcListCache,
            bookStr: ''
        })
    }

    renderCalcList(){
        const coulmns = [
            { title: '责任', dataIndex: 'payDutyName', align: 'center'},
            { title: '合规费用A', dataIndex: 'complianceFee', align: 'center' },
            { title: '剩余免赔额/次免赔额B', dataIndex: 'franchiseTotal', align: 'center' },
            { title: '赔付比例C', dataIndex: 'onePayProportion', align: 'center' },
            { title: '罚则比例F', dataIndex: 'punishmentPayProportion', align: 'center' },
            { title: '限额G', dataIndex: 'limitMoney', align: 'center', width: 80 },
            { title: '理赔金额K', dataIndex: 'insurancePay', align: 'center', width: 80 },
            { title: '免赔额抵扣', dataIndex: 'franchise', align: 'center', width: 80 },
            { title: '其他扣款I', dataIndex: 'otherDeductMoney', align: 'center' },
            { title: '计算公式', dataIndex: 'comFormula', align: 'center', width: 240 },
            { title: '操作', dataIndex: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="删除" onClick={this.delCalc.bind(this, record)}>
                            <span><Icon type="delete" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        const props = {
            rowKey: 'key',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.calcList,
            pagination: false,
            title: () => (
                <Row type="flex" justify="space-between">
                    <Col><strong>理算信息</strong></Col>
                    <Col>
                        <Button type="primary" size="small" onClick={ this.onSubmit.bind(this, 3) }>理算</Button>
                    </Col>
                </Row>
            ) 
        }
        return(
            <Table bordered className="list-table" {...props} style={{ margin: 15 }} />
        )
    }
    delCalc = delItem => {
        let calcList = this.state.calcList.slice()

        calcList = calcList.filter(item => item.key !== delItem.key)
        this.setState({
            calcList,
            bookStr: ''
        })
    }
    calcBook = () => {
        if(this.state.calcList.length === 0){
            message.error('请先进行理算')
            return
        }
        let bookStr = ''
        let str1 = ''
        let str2 = ''
        let num = 0
        this.state.calcList.forEach(item => {
            str1 += `${item.payDutyName}${item.comFormula} `
            str2 += `${item.payDutyName}赔付金额+`
            num += Number(item.insurancePay)
        })
        str2 = str2.substring(0, str2.length-1)

        bookStr = `${str1}赔付金额合计=${str2}=${num}`
        this.setState({
            bookStr
        })
    }
    apply = (values, flag) => {
        // flag 1: 立案， 2: 暂存
        console.log(flag)
        if(flag === 1){
            if(this.state.prescriptionList.length === 0){
                message.error('请先录入处方信息')
                return
            }
            if(this.state.calcList.length === 0){
                message.error('请先进行理算')
                return
            }
            if(this.state.bookStr === ''){
                message.error('请先生成计算书')
                return
            }
        }
        
        let visitList = []
        if(this.state.relevanceType === '01' || this.state.relevanceType === '02'){
            let visitInfo = JSON.parse(JSON.stringify(this.state.visitTotalData));
            visitInfo['id'] = this.state.visitList.length > 0 ? this.state.visitList[0].id : undefined;
            visitInfo['partSelfAmnt'] = this.state.partSelfAmnt
            visitInfo['selfAmnt'] = this.state.selfAmnt
            delete visitInfo.key
            visitList = [visitInfo]

            if(flag === 1){
                let totalMoney = 0
                let selfAmntTotal = 0
                let partSelfAmntTotal = 0
                this.state.prescriptionList.forEach(item => {
                    totalMoney += Number(item.money)
                    selfAmntTotal += Number(item.selfAmnt)
                    partSelfAmntTotal += Number(item.partSelfAmnt)
                })
                if(Number(values.medicalTotalMoney) !== Number(totalMoney.toFixed(2))){
                    message.error('处方总金额不等于医疗总费用')
                    return
                }
                if(Number(Number(partSelfAmntTotal).toFixed(2)) !== Number(this.state.partSelfAmnt)){
                    message.error('处方乙类自理总金额不等于就诊中乙类自理金额')
                    return
                }
                if(Number(Number(selfAmntTotal).toFixed(2)) !== Number(this.state.selfAmnt)){
                    message.error('处方自费总金额不等于就诊中自费金额')
                    return
                }
            }
        }else{
            visitList = this.state.visitList
            visitList[0].dutyRange = this.state.duty_range.join()
        }
        let prescriptionList = JSON.parse(JSON.stringify(this.state.prescriptionList))
        let prescriptionValid = true
        prescriptionList.forEach(item => {
            if(item.isValid === '0'){
                prescriptionValid = false
            }
        })
        if(!prescriptionValid){
            message.error('处方信息请填写完整')
            return
        }
        prescriptionList.forEach(item => {
            delete item.key
            delete item.isValid
            delete item.ylRatio
        })

        let inputVisitList = JSON.parse(JSON.stringify(this.state.inputVisitList))
        inputVisitList.forEach(item => {
            delete item.key
        })

        let data = {
            id: this.state.case.id,
            insurancePolicy: { id: this.state.caseInfo.policyId },
            medicalVisitInfos: visitList,
            policyFeeDTODs: this.state.calcList,
            visitInfoBalanceCategoryList: prescriptionList,
            comFormula: this.state.bookStr,
            momentSaveFlag: '0',
            acceptRemark: this.state.acceptRemark,
            visitDetailInfoEntityList: inputVisitList
        }
        let url = '/rs/api/claim/caseinfo/handCalc'
        if(flag === 2){
            data.momentSaveFlag = '1'
            url = '/rs/api/claim/caseinfo/handAddCase'
        }

        data['ambulantRegisterFlag'] = '1'
        http.post(url, data, { isLoading: true }).then(res => {
            if(res.ambulantRegisterResultFlag === '1'){
                Modal.confirm({
                    title: '提示',
                    content: '录入的案件信息与系统存在重复数据，防止重复报销，请认真确认是否要继续？',
                    onOk: () => {
                        data['ambulantRegisterFlag'] = '0'
                        http.post(url, data, { isLoading: true }).then(res2 => {
                            if(flag === 1){
                                message.success(res2.message)
                                if(res2.firstCheckFlag === '0'){
                                    this.setState({
                                        isReQuery: true
                                    })
                                }else{
                                    this.props.onClose('suc')
                                }
                            }else{
                                message.success('暂存成功')
                                this.props.onClose('suc')
                            }
                        })
                    }
                })
            }else{
                if(flag === 1){
                    message.success(res.message)
                    if(res.firstCheckFlag === '0'){
                        this.setState({
                            isReQuery: true
                        })
                    }else{
                        this.props.onClose('suc')
                    }
                }else{
                    message.success('暂存成功')
                    this.props.onClose('suc')
                }
            }
        })
    }
    reQuery = () => {
        http.post('/rs/api/claim/caseinfo/handCalcSupplement', { id: this.state.case.id }, { isLoading: true }).then(res => {
            message.success(res.message)
            if(res.firstCheckFlag === '0'){
                this.setState({
                    isReQuery: true
                })
            }else{
                this.setState({
                    isReQuery: false
                })
                this.props.onClose('suc')
            }
        })
    }
    changeAcceptRemark = e => {
        this.setState({
            acceptRemark: e.target.value
        })
    }
}
ApplyInput = Form.create()(ApplyInput)
export default ApplyInput;