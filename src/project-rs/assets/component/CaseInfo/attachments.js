import React, { Component } from 'react';
import { Collapse } from 'antd';
import ImgScroll from '../ImgScroll';

class Attachments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            medicalList: [],
            identityList: [],
            medicalImgIndex: 0,
            identityImgIndex: 0
        }
    }
    componentDidMount() {
        this.initImgs(this.props)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.initImgs(nextProps)
    }
    initImgs = props => {
        let list = props.list ? props.list : [];
        let medicalList = [];
        let identityList = [];
        list.forEach(item => {
            if(item.serviceType === '01' || item.fileType === '01'){
                medicalList.push(item)
            }else if(item.serviceType === '02' || item.fileType === '02'){
                identityList.push(item)
            }
        })
        this.setState({
            medicalList,
            identityList
        })
    }
    render() {
        const Panel = Collapse.Panel;
        return (
            <Collapse defaultActiveKey={['medicalImage']} accordion>
                <Panel header="医学类影像" key="medicalImage">
                    <div style={{ width: 700, margin: '0 auto' }}>
                        <ImgScroll list={ this.state.medicalList } />
                    </div>
                </Panel>
                <Panel header="身份类影像" key="identityImage">
                    <div style={{ width: 700, margin: '0 auto' }}>
                        <ImgScroll list={ this.state.identityList } />
                    </div>
                </Panel>
            </Collapse>
        )
    }
}
export default Attachments;