import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Breadcrumb, Table, Icon, Tooltip, Modal, Tabs, Badge, Row, Col, Button, Divider} from 'antd'
import moment from 'moment'
import http from '@/utils/http'
import ReactZmage from 'react-zmage'

import FormSearch from './FormSearch'
import BaseInfo from '@/project-gs/assets/component/caseInfo/baseInfo'
import BankInfo from '@/project-gs/assets/component/caseInfo/bankInfo'
import InsuredInfo from '@/project-gs/assets/component/caseInfo/insuredInfo'
import CaseResultInfo from '@/project-gs/assets/component/caseInfo/caseResultInfo'
import FeeDetailList from '@/project-gs/assets/component/caseInfo/feeDetailList'
import FeeInfo from '@/project-gs/assets/component/caseInfo/feeInfo'
import WxInfoList from '@/project-gs/assets/component/caseInfo/wxInfoList'
import WxMessageInfo from '@/project-gs/assets/component/caseInfo/wxMessageInfo'

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            //列表数据
            listObj: {},
            //查询条件数据
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            //查看详情
            visible: false,
            //详情基本信息
            tabKey: '1',
            //详情数据
            caseDetail:{},
            //结算费用
            claimList:[],
            //费用明细
            claimDetailList:[],
            wxInfoList:[],
            //查看附件
            attachmentVisible:false,
            attachmentTabKey: '1',
            //附件列表
            attachmentObj:{}
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 300
        })
        //查询列表数据
        this.getList(1)
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>理赔报案</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <span>查询条件</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch }/>
                        { this.renderList() }
                    </div>
                </div>
                { this.renderDetailModal() }
                {this.renderMessageInfoModal() }
                { this.renderAttachmentModal() }
            </div>
        )
    }
    //列表定义
    renderList(){
        const coulmns = [
            { title: '申请人身份', dataIndex: 'applyType', align: 'center',
                render: (text, r) => {
                    var name = "";
                    if(text && text=="01"){
                        name = "本人申请";
                    }
                    if(text && text=="02"){
                        name = "监护人申请";
                    }
                    return <span style={{ color: r.color }}>{name}</span>
                }
            },
            { title: '出险人', dataIndex: 'insuredName', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '出险人证件号码', dataIndex: 'idCode', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '手机号码', dataIndex: 'telephone', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '报案时间', dataIndex: 'createdTime', align: 'center', width: '16%',
                render: (text, r) => <span style={{ color: r.color }}>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '' }</span>
            },
            { title: '案件状态', dataIndex: 'caseState', align: 'center', width: '15%',
                render: (text, r) => {
                    var name = "";
                    if(text && text=="01"){
                        name ="录入完成,待影像件";
                    }
                    if(text && text=="02"){
                        name ="影像件完成";
                    }
                    if(text && text=="03"){
                        name ="已推送国寿";
                    }
                    if(text && text=="04"){
                        name ="结案";
                    }
                    return <span style={{ color: r.color }}>{name}</span>
                }
            },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center', width: '8%',
                render: (text, r) => <span style={{ color: r.color }}>{ text ? moment(text).format('YYYY-MM-DD') : '' }</span>
            },
            { title: '出险原因', dataIndex: 'accidentReason', align: 'center',
                render: (text, r) => {
                    var name = "";
                    if(text && text=="1"){
                        name = "疾病";
                    }
                    if(text && text=="2"){
                        name = "意外";
                    }
                    return <span style={{ color: r.color }}>{name}</span>
                }
            },
            { title: '个人服务号', dataIndex: 'claimNo', align: 'center',
                render: (text, r) => <span style={{ color: r.color }}>{text}</span>
            },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="查看影像件" onClick={this.attachment.bind(this, record.caseAttachmentEntityList,record.indemnityCaseNo)}>
                            <span><Icon type="file-image" /></span>
                        </Tooltip>
                        <Tooltip title="查看消息" onClick={this.messageInfo.bind(this, record)}>
                            <span><Icon type="message" /></span>
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
            <Table bordered className="list-table" {...props}/>
        )
    }
    //查询条件
    querySearch = data => {
        this.setState({
            searchData: data
        }, () => {
            this.getList(1)
        })
    }
    //发送微信消息
    sendWxMessage = data => {
        http.post('/guoshou/claim/api/v1/wechat/sendWxMsg', data,{ isLoading: true }).then(res => {
            this.setState({
                messageTabKey: '2'
            })
            this.wxInfotabChange('2')
        })
    }
    //查询列表数据
    getList = current => {
        this.setState({
            currentPage: current,
            isLoading: true
        })
        let data = this.state.searchData
        data.currentPage = current
        data.pageSize = this.state.pageSize
        http.post('/guoshou/claim/api/v1/case/getCaseList', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    //查看详情
    detail = record => {
        this.setState({
            visible: true,
            tabKey: '1',
            caseDetail: record,
            //结算费用
            claimList:[],
            //费用明细
            claimDetailList:[]
        })
    }
    //查看详情
    messageInfo = record => {
        this.setState({
            messageVisible: true,
            messageTabKey: '1',
            caseDetail: record
        })
    }
    renderMessageInfoModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="消息发送"
                width="60%"
                centered
                visible={ this.state.messageVisible }
                onCancel={ this.closeMessageDetail }
                footer={ null }
            >
                <div className="modal-detail-content" id="detail" style={{ height: this.state.conHeight }}>
                    <Tabs activeKey={ this.state.messageTabKey } onChange={ this.wxInfotabChange }>
                        <TabPane tab="消息发送" key="1">
                            <WxMessageInfo caseNo={ this.state.caseDetail.indemnityCaseNo} sendWxMessage={this.sendWxMessage}/>
                        </TabPane>
                        <TabPane tab="历史消息" key="2">
                            <WxInfoList list={ this.state.wxInfoList} />
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
    renderDetailModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="报案详情"
                width="60%"
                centered
                visible={ this.state.visible }
                onCancel={ this.closeDetail }
                footer={ null }
            >
                <div className="modal-detail-content" id="detail" style={{ height: this.state.conHeight }}>
                    <Tabs activeKey={ this.state.tabKey } onChange={ this.tabChange } >
                        <TabPane tab="基本信息" key="1">
                            <BaseInfo detail={ this.state.caseDetail} />
                        </TabPane>
                        <TabPane tab="银行信息" key="2">
                            <BankInfo detail={ this.state.caseDetail.protectorInfo?this.state.caseDetail.protectorInfo:this.state.caseDetail} />
                        </TabPane>
                        <TabPane tab="出险信息" key="3">
                            <InsuredInfo detail={ this.state.caseDetail} />
                        </TabPane>
                        <TabPane tab="费用信息" key="4">
                            <FeeDetailList list={ this.state.claimDetailList} />
                        </TabPane>
                        <TabPane tab="结算信息" key="5">
                            <FeeInfo detail={ this.state.claimList} />
                        </TabPane>
                        <TabPane tab="理赔结果" key="6">
                            <CaseResultInfo detail={ this.state.caseDetail} />
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
    closeDetail = () => {
        this.setState({
            visible: false
        })
    }
    closeMessageDetail = () => {
        this.setState({
            messageVisible: false
        })
    }
    tabChange = key => {
        this.setState({
            tabKey: key
        })
        //结算信息
        if(key == '5' && this.state.claimList.length == 0){
            let claimQueryData = {controlAreaCode:this.state.caseDetail.controlAreaCode,orgCode:this.state.caseDetail.orgCode,visitNo:this.state.caseDetail.visitNo,idCode:this.state.caseDetail.idCode}
            if(claimQueryData.controlAreaCode && claimQueryData.orgCode && claimQueryData.visitNo && claimQueryData.idCode){
                http.post('/guoshou/claim/api/v1/claim/list', claimQueryData, { isLoading: true }).then(res => {
                    this.setState({
                        claimList:res
                    })
                })
            }
        }
        //费用明细
        if(key == '4' && this.state.claimDetailList.length == 0){
            let claimQueryData = {controlAreaCode:this.state.caseDetail.controlAreaCode,orgCode:this.state.caseDetail.orgCode,visitNo:this.state.caseDetail.visitNo,idCode:this.state.caseDetail.idCode}
            if(claimQueryData.controlAreaCode && claimQueryData.orgCode && claimQueryData.visitNo && claimQueryData.idCode){
                http.post('/guoshou/claim/api/v1/claim/detailList', claimQueryData, { isLoading: true }).then(res => {
                    this.setState({
                        claimDetailList:res
                    })
                })
            }
        }
    }
    wxInfotabChange = key => {
        this.setState({
            messageTabKey: key
        })
        //结算信息
        if(key == '2' ){
            let claimQueryData = {indemnityCaseNo:this.state.caseDetail.indemnityCaseNo}
            http.post('/guoshou/claim/api/v1/wechat/getWxMsgList', claimQueryData, { isLoading: true }).then(res => {
                this.setState({
                    wxInfoList:res.content
                })
            })
        }
    }
    renderAttachmentModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="附件管理"
                width="60%"
                centered
                visible={ this.state.attachmentVisible }
                onCancel={ this.closeAttachment }
                footer={ null }
            >
                <div className="modal-detail-content" id="attachment" style={{ height: this.state.conHeight }}>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={this.downloadFile.bind(this, this.state.caseNo)}>
                            <Icon type="download" /> 全部下载
                        </Button>
                    </div>
                    <Tabs activeKey={ this.state.attachmentTabKey } onChange={ this.tabAttachmentChange } >
                        <TabPane tab="身份证件" key="1">
                            <Row>
                                <Col span={12}>
                                    <Row style={{marginLeft:10,marginBottom:10}}><span>出险人证件照片</span></Row>
                                    <Row>
                                        {
                                            this.state.attachmentObj.image1_1 && this.state.attachmentObj.image1_1.length > 0
                                            ? this.state.attachmentObj.image1_1.map((image)=>{return <ReactZmage src={"/images/"+image.fileRoute} style={{width:150,height:100,marginLeft:10}} />})
                                            : <div style={{ textAlign: 'left', padding: 30, color: '#999' }}>暂无数据</div>
                                        }
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row style={{marginLeft:10,marginBottom:10}}><span>监护人证件照片</span></Row>
                                    <Row>
                                        {
                                            this.state.attachmentObj.image1_2 && this.state.attachmentObj.image1_2.length > 0
                                                ? this.state.attachmentObj.image1_2.map((image)=>{return <ReactZmage src={"/images/"+image.fileRoute} style={{width:150,height:100,marginLeft:10}} />})
                                                : <div style={{ textAlign: 'left', padding: 30, color: '#999' }}>暂无数据</div>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Divider />
                            <Row style={{marginTop:10}}>
                                <Col span={12}>
                                    <Row style={{marginLeft:10,marginBottom:10}}><span>关系证明</span></Row>
                                    <Row>
                                        {
                                            this.state.attachmentObj.image5 && this.state.attachmentObj.image5.length > 0
                                                ? this.state.attachmentObj.image5.map((image)=>{return <ReactZmage src={"/images/"+image.fileRoute} style={{width:150,height:100,marginLeft:10}} />})
                                                : <div style={{ textAlign: 'left', padding: 30, color: '#999' }}>暂无数据</div>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="银行证件" key="2">
                            <Row>
                                <Col>
                                    <Row style={{marginLeft:10,marginBottom:10}}><span>银行卡</span></Row>
                                    <Row>
                                        {
                                            this.state.attachmentObj.image2 && this.state.attachmentObj.image2.length > 0
                                                ? this.state.attachmentObj.image2.map((image)=>{return <ReactZmage src={"/images/"+image.fileRoute} style={{width:150,height:100,marginLeft:10}} />})
                                                : <div style={{ textAlign: 'left', padding: 30, color: '#999' }}>暂无数据</div>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Divider />
                        </TabPane>
                        <TabPane tab="医学资料" key="3">
                            <Row>
                                <Col>
                                    <Row style={{marginLeft:10,marginBottom:10}}><span>医学资料</span></Row>
                                    <Row>
                                        {
                                            this.state.attachmentObj.image3 && this.state.attachmentObj.image3.length > 0
                                                ? this.state.attachmentObj.image3.map((image)=>{return <ReactZmage src={"/images/"+image.fileRoute} style={{width:150,height:100,marginLeft:10,marginBottom:10}} />})
                                                : <div style={{ textAlign: 'left', padding: 30, color: '#999' }}>暂无数据</div>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Divider />
                        </TabPane>
                        <TabPane tab="授权协议" key="4">
                            <Row>
                                <Col>
                                    <Row style={{marginLeft:10,marginBottom:10}}><span>授权协议</span></Row>
                                    <Row>
                                        {
                                            this.state.attachmentObj.image4 && this.state.attachmentObj.image4.length > 0
                                                ? this.state.attachmentObj.image4.map((image)=>{return <ReactZmage src={"/images/"+image.fileRoute} style={{width:150,height:100,marginLeft:10,marginBottom:10}} />})
                                                : <div style={{ textAlign: 'left', padding: 30, color: '#999' }}>暂无数据</div>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Divider />
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
    attachment = (file,caseNo) => {
        var attachmentObj = {};
        //身份证
        var image1_1 = [];
        var image1_2 = [];
        //银行卡
        var image2 = [];
        //医学材料
        var image3 = [];
        //授权协议
        var image4 = [];
        //关系证明
        var image5 = [];
        for (let f of file) {
            if(f.serviceType=="02" || f.serviceType=="03"){
                image1_1.push(f);
            }
            if(f.serviceType=="05" || f.serviceType=="06"){
                image1_2.push(f);
            }
            if(f.serviceType=="01"){
                image2.push(f);
            }
            if(f.serviceType=="08"){
                image3.push(f);
            }
            if(f.serviceType=="09"){
                image4.push(f);
            }
            if(f.serviceType=="04"){
                image5.push(f);
            }
        }
        attachmentObj.image1_1=image1_1;
        attachmentObj.image1_2=image1_2;
        attachmentObj.image2=image2;
        attachmentObj.image3=image3;
        attachmentObj.image4=image4;
        attachmentObj.image5=image5;
        this.setState({
            attachmentVisible: true,
            attachmentTabKey: '1',
            attachmentObj:attachmentObj,
            caseNo:caseNo
        })
    }
    closeAttachment = () => {
        this.setState({
            attachmentVisible: false
        })
    }
    tabAttachmentChange = key => {
        this.setState({
            attachmentTabKey: key
        })
    }
    downloadFile = (caseNo) =>{
        window.location.href = `/guoshou/claim/api/v1/case/downCaseFileZip?caseNo=${caseNo}`;
    }
}
export default index
