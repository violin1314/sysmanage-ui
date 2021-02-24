import React, { Component } from 'react';
import { Descriptions, Divider, Spin, Table } from 'antd';

import http from '@/utils/http'

class InsurancePolicyDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            id: '',
            policyInfo: {},
            insuredInfo: {},
            holderInfo: {},
            beneficiaryList: [],
            selectedKeys: [],
            beneficiary: {}
        }
    }
    componentDidMount(){
        this.setState({
            id: this.props.id
        }, () => {
            this.getDetail()
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(this.props.id === nextProps.id){
            return
        }
        this.setState({
            id: nextProps.id
        }, () => {
            this.getDetail()
        })
    }
    render(){
        return (
            <Spin spinning={ this.state.loading }>
                <div>
                    <Descriptions size="small" style={{ padding: '0 20px' }}>
                        <Descriptions.Item label="个人保单号">{ this.state.policyInfo.policyNo }</Descriptions.Item>
                        <Descriptions.Item label="险种产品名称">{ this.state.policyInfo.insuranceName }</Descriptions.Item>
                        <Descriptions.Item label="保单状态">{ this.state.policyInfo.insurancePolicyStateName }</Descriptions.Item>
                        <Descriptions.Item label="起保日期">{ this.state.policyInfo.startInsuranceDate }</Descriptions.Item>
                        <Descriptions.Item label="保单生效日期">{ this.state.policyInfo.startDate }</Descriptions.Item>
                        <Descriptions.Item label="保单终止日期">{ this.state.policyInfo.endDate }</Descriptions.Item>
                        <Descriptions.Item label="团体保单号">{ this.state.policyInfo.groupPolicyNo }</Descriptions.Item>
                        <Descriptions.Item label="团体名称">{ this.state.policyInfo.groupName }</Descriptions.Item>
                        <Descriptions.Item label="总人数">{ this.state.policyInfo.totalNumber }</Descriptions.Item>
                        <Descriptions.Item label="总保费">{ this.state.policyInfo.totalPremium }</Descriptions.Item>
                        <Descriptions.Item label="险种类型">{ this.state.policyInfo.insuranceType }</Descriptions.Item>
                        <Descriptions.Item label="险种状态">{ this.state.policyInfo.polStateName }</Descriptions.Item>
                        <Descriptions.Item label="是否高管">
                            {this.state.policyInfo.isManager === '1' && '是'}
                            {this.state.policyInfo.isManager === '0' && '否'}
                        </Descriptions.Item>
                        <Descriptions.Item label="是否罹患既往症">
                            {this.state.policyInfo.previousDiseaseFlag === '1' && '是'}
                            {this.state.policyInfo.previousDiseaseFlag === '0' && '否'}
                        </Descriptions.Item>
                        <Descriptions.Item label="员工/家属">{ this.state.policyInfo.personStatusFlagName }</Descriptions.Item>
                        <Descriptions.Item label="是否新参保">{ this.state.policyInfo.isFirstInsuranceFlagName }</Descriptions.Item>
                        <Descriptions.Item label="产品名称">{ this.state.policyInfo.productName }</Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Descriptions size="small" style={{ padding: '0 20px' }}>
                        <Descriptions.Item label="被保险人姓名">{ this.state.insuredInfo.insuredName }</Descriptions.Item>
                        <Descriptions.Item label="投保时年龄">{ this.state.insuredInfo.assuredAgeMonths }</Descriptions.Item>
                        <Descriptions.Item label="与投保人关系">{ this.state.insuredInfo.relationshipName }</Descriptions.Item>
                        <Descriptions.Item label="性别">{ this.state.insuredInfo.sexName }</Descriptions.Item>
                        <Descriptions.Item label="出生日期">{ this.state.insuredInfo.birthday }</Descriptions.Item>
                        <Descriptions.Item label="国籍">{ this.state.insuredInfo.citizenShipName }</Descriptions.Item>
                        <Descriptions.Item label="证件类型">{ this.state.insuredInfo.idTypeName }</Descriptions.Item>
                        <Descriptions.Item label="证件号">{ this.state.insuredInfo.idCode }</Descriptions.Item>
                        <Descriptions.Item label="证件有效期">{ this.state.insuredInfo.idExpiryDate }</Descriptions.Item>
                        <Descriptions.Item label="人员类别">{ this.state.insuredInfo.personTypeName }</Descriptions.Item>
                        <Descriptions.Item label="医保个人编号">{ this.state.insuredInfo.personId }</Descriptions.Item>
                        <Descriptions.Item label="医保卡归属地">{ this.state.insuredInfo.ybCity }</Descriptions.Item>
                        <Descriptions.Item label="客户号">{ this.state.insuredInfo.clientNo }</Descriptions.Item>
                        <Descriptions.Item label="职业">{ this.state.insuredInfo.professionKindName }</Descriptions.Item>
                        <Descriptions.Item label="电子邮箱">{ this.state.insuredInfo.email }</Descriptions.Item>
                        <Descriptions.Item label="手机号码">{ this.state.insuredInfo.telephone }</Descriptions.Item>
                        <Descriptions.Item label="办公电话">{ this.state.insuredInfo.officePhone }</Descriptions.Item>
                        <Descriptions.Item label="家庭电话">{ this.state.insuredInfo.homePhone }</Descriptions.Item>
                        <Descriptions.Item label="省">{ this.state.insuredInfo.addressProvince }</Descriptions.Item>
                        <Descriptions.Item label="市">{ this.state.insuredInfo.addressCity }</Descriptions.Item>
                        <Descriptions.Item label="区/县">{ this.state.insuredInfo.addressCountry }</Descriptions.Item>
                        <Descriptions.Item label="开户银行账号">{ this.state.insuredInfo.bankAccount }</Descriptions.Item>
                        <Descriptions.Item label="开户银行户名">{ this.state.insuredInfo.bankHousehold }</Descriptions.Item>
                        <Descriptions.Item label="开户银行编码">{ this.state.insuredInfo.bankCode }</Descriptions.Item>
                        <Descriptions.Item label="详细地址" span={3}>{ this.state.insuredInfo.detailedAddress }</Descriptions.Item>
                        <Descriptions.Item label="通讯地址" span={3}>{ this.state.insuredInfo.communtAddress }</Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Descriptions size="small" style={{ padding: '0 20px' }}>
                        <Descriptions.Item label="投保人姓名">{ this.state.holderInfo.policyHolderName }</Descriptions.Item>
                        <Descriptions.Item label="客户号">{ this.state.holderInfo.clientNo }</Descriptions.Item>
                        <Descriptions.Item label="投保人类型">{ this.state.holderInfo.policyHolderTypeName }</Descriptions.Item>
                        <Descriptions.Item label="性别">{ this.state.holderInfo.sexName }</Descriptions.Item>
                        <Descriptions.Item label="出生日期">{ this.state.holderInfo.birthday }</Descriptions.Item>
                        <Descriptions.Item label="国籍">{ this.state.holderInfo.citizenShipName }</Descriptions.Item>
                        <Descriptions.Item label="证件类型">{ this.state.holderInfo.idTypeName }</Descriptions.Item>
                        <Descriptions.Item label="证件号">{ this.state.holderInfo.idCode }</Descriptions.Item>
                        <Descriptions.Item label="证件有效期">{ this.state.holderInfo.idExpiryDate }</Descriptions.Item>
                        <Descriptions.Item label="人员类别">{ this.state.holderInfo.personTypeName }</Descriptions.Item>
                        <Descriptions.Item label="医保个人编号">{ this.state.holderInfo.personId }</Descriptions.Item>
                        <Descriptions.Item label="医保卡归属地">{ this.state.holderInfo.ybCity }</Descriptions.Item>
                        <Descriptions.Item label="电子邮箱">{ this.state.holderInfo.email }</Descriptions.Item>
                        <Descriptions.Item label="手机号码">{ this.state.holderInfo.telephone }</Descriptions.Item>
                        <Descriptions.Item label="职业">{ this.state.holderInfo.professionKindName }</Descriptions.Item>
                        <Descriptions.Item label="省">{ this.state.holderInfo.addressProvince }</Descriptions.Item>
                        <Descriptions.Item label="市">{ this.state.holderInfo.addressCity }</Descriptions.Item>
                        <Descriptions.Item label="区/县">{ this.state.holderInfo.addressCountry }</Descriptions.Item>
                        <Descriptions.Item label="开户银行账号">{ this.state.holderInfo.bankAccount }</Descriptions.Item>
                        <Descriptions.Item label="开户银行户名">{ this.state.holderInfo.bankHousehold }</Descriptions.Item>
                        <Descriptions.Item label="开户银行编码">{ this.state.holderInfo.bankCode }</Descriptions.Item>
                        <Descriptions.Item label="单位" span={3}>{ this.state.holderInfo.unitName }</Descriptions.Item>
                        <Descriptions.Item label="详细地址" span={3}>{ this.state.holderInfo.detailedAddress }</Descriptions.Item>
                        <Descriptions.Item label="通讯地址" span={3}>{ this.state.holderInfo.communiAddress }</Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Descriptions size="small" style={{ padding: '0 20px' }}>
                        <Descriptions.Item label="本期保费">{ this.state.policyInfo.currentPremium }</Descriptions.Item>
                        <Descriptions.Item label="保额">{ this.state.policyInfo.amount }</Descriptions.Item>
                        <Descriptions.Item label="缴费方式">{ this.state.policyInfo.payIntvName }</Descriptions.Item>
                        <Descriptions.Item label="保障期间">{ this.state.policyInfo.insuYear }</Descriptions.Item>
                        <Descriptions.Item label="保障年期/年龄标志">{ this.state.policyInfo.insuYearFlag }</Descriptions.Item>
                        <Descriptions.Item label="免赔额">{ this.state.policyInfo.franchise }</Descriptions.Item>
                        <Descriptions.Item label="缴费期间">{ this.state.policyInfo.payEndYear }</Descriptions.Item>
                        <Descriptions.Item label="缴费年期/年龄标志">{ this.state.policyInfo.payEndYearFlag }</Descriptions.Item>
                        <Descriptions.Item label="本期累计赔付金额">{ this.state.policyInfo.insurancePayCurrent }</Descriptions.Item>
                        <Descriptions.Item label="销售渠道">{ this.state.policyInfo.businessChnlName }</Descriptions.Item>
                        <Descriptions.Item label="银行/中介代理机构编号">{ this.state.policyInfo.agentCom }</Descriptions.Item>
                        <Descriptions.Item label="银行/中介代理机构名称">{ this.state.policyInfo.agentComName }</Descriptions.Item>
                        <Descriptions.Item label="代理人">{ this.state.policyInfo.agentName }</Descriptions.Item>
                        <Descriptions.Item label="银行/中介/个险代理人">{ this.state.policyInfo.agentCode1Name }</Descriptions.Item>
                        <Descriptions.Item label="所属分公司">{ this.state.policyInfo.manageComName }</Descriptions.Item>
                        <Descriptions.Item label="保险公司销售人员工号">{ this.state.policyInfo.salemanCode }</Descriptions.Item>
                        <Descriptions.Item label="保险公司销售人员姓名">{ this.state.policyInfo.salesmanName }</Descriptions.Item>
                        <Descriptions.Item label="所属分公司中支地址">{ this.state.holderInfo.manageComAddress }</Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    { this.renderList() }
                    <Descriptions size="small" style={{ padding: '0 20px' }}>
                        <Descriptions.Item label="受益人姓名">{ this.state.beneficiary.name }</Descriptions.Item>
                        <Descriptions.Item label="性别">{ this.state.beneficiary.sexName }</Descriptions.Item>
                        <Descriptions.Item label="客户号">{ this.state.beneficiary.clientNo }</Descriptions.Item>
                        <Descriptions.Item label="证件类型">{ this.state.beneficiary.idTypeName }</Descriptions.Item>
                        <Descriptions.Item label="证件号">{ this.state.beneficiary.idCode }</Descriptions.Item>
                        <Descriptions.Item label="出生日期">{ this.state.beneficiary.birthday }</Descriptions.Item>
                        <Descriptions.Item label="与被保险人关系">{ this.state.beneficiary.relationNameName }</Descriptions.Item>
                        <Descriptions.Item label="受益顺序">{ this.state.beneficiary.beneficialOrder }</Descriptions.Item>
                        <Descriptions.Item label="受益比例">{ this.state.beneficiary.benefitRate === 'null' || this.state.beneficiary.benefitRate === null ? '' : this.state.beneficiary.benefitRate }</Descriptions.Item>
                        <Descriptions.Item label="移动电话">{ this.state.beneficiary.telephone }</Descriptions.Item>
                        <Descriptions.Item label="职业">{ this.state.beneficiary.occupationCodeName }</Descriptions.Item>
                        <Descriptions.Item label="付款方式">{ this.state.beneficiary.paymentTypeName }</Descriptions.Item>
                        <Descriptions.Item label="开户行名称">{ this.state.beneficiary.oepningBank }</Descriptions.Item>
                        <Descriptions.Item label="银行名称">{ this.state.beneficiary.oepningBank }</Descriptions.Item>
                        <Descriptions.Item label="账户名">{ this.state.beneficiary.bankHousehold }</Descriptions.Item>
                        <Descriptions.Item label="省">{ this.state.beneficiary.addressProvince }</Descriptions.Item>
                        <Descriptions.Item label="市">{ this.state.beneficiary.addressCity }</Descriptions.Item>
                        <Descriptions.Item label="区/县">{ this.state.beneficiary.addressCountry }</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{ this.state.beneficiary.email }</Descriptions.Item>
                        <Descriptions.Item label="特别约定内容">{ this.state.beneficiary.specialAgreementContent }</Descriptions.Item>
                        <Descriptions.Item label="受益人类别">{ this.state.beneficiary.typeName }</Descriptions.Item>
                        <Descriptions.Item label="备注">{ this.state.insuredInfo.remark }</Descriptions.Item>
                    </Descriptions>
                </div>
            </Spin>
        )
    }
    renderList(){
        const coulmns = [
            { title: '受益人姓名', dataIndex: 'name', align: 'center'},
            { title: '与被保险人关系', dataIndex: 'relationNameName', align: 'center'},
            { title: '受益顺序', dataIndex: 'beneficialOrder', align: 'center'},
            { title: '受益比例', dataIndex: 'benefitRate', align: 'center',
                render: text => text === 'null' || text === null ? '' : text
            },
            { title: '客户号', dataIndex: 'clientNo', align: 'center'},
            { title: '移动电话', dataIndex: 'telephone', align: 'center'},
            { title: '付款方式', dataIndex: 'paymentTypeName', align: 'center'},
            { title: '职业', dataIndex: 'occupationCodeName', align: 'center'},
            { title: '性别', dataIndex: 'sexName', align: 'center'},
            { title: '受益人类别', dataIndex: 'typeName', align: 'center'}
        ]
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.beneficiaryList,
            pagination: false,
            title: () => '受益人信息',
            rowSelection: {
                type: 'radio',
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        selectedKeys: keys,
                        beneficiary: rows[0]
                    })
                }
            }
        }
        return(
            <div style={{ padding: '0 10px 10px' }}>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }
    getDetail = () => {
        if(!this.state.id){
            return
        }
        this.setState({
            loading: true,
            policyInfo: {},
            insuredInfo: {},
            holderInfo: {},
            beneficiaryList: [],
            beneficiary: {}
        })
        http.post('/rs/api/claim/policyPerson/findPolicyPersonByID', { id: this.state.id }).then(res => {
            this.setState({
                loading: false,
                policyInfo: res.insurancePolicyInfoEntity,
                insuredInfo: res.insuredInfoEntity,
                holderInfo: res.policyHolderInfoEntity,
                beneficiaryList: res.beneficiaryInfolist,
                selectedKeys: [res.beneficiaryInfolist[0].id],
                beneficiary: res.beneficiaryInfolist[0]
            })
        })
    }
}
export default InsurancePolicyDetail;