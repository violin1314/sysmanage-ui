import React, { Component } from 'react';
import { Row, Col, Button, Icon, message } from 'antd';
import utils from '@/utils'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'

let imgServer = '/images/';

class ImgScroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgList: [],
            imgIndex: 0,
            curImg: {},
            rotateDeg: 0,
            imgLoading: false
        }
        this.myCropper = null
    }
    componentDidMount() {
        this.setState({
            imgIndex: 0,
            curImg: this.props.list.length ? this.props.list[0] : {},
            imgList: this.props.list ? this.props.list : [],
            imgSrc: this.props.list.length ? imgServer + this.props.list[0].reduceFileRoute : ''
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.list === this.props.list){
            return
        }
        this.setState({
            imgIndex: 0,
            rotateDeg: 0,
            curImg: nextProps.list.length ? nextProps.list[0] : {},
            imgList: nextProps.list ? nextProps.list : [],
            imgLoading: false,
            imgSrc: nextProps.list.length ? imgServer + nextProps.list[0].reduceFileRoute : ''
        }, () => {
            this.initCropper()
        })
    }
    initCropper = () => {
        this.myCropper && this.myCropper.destroy();
        
        if(this.refs.image){
            this.myCropper = new Cropper(this.refs.image, {
                viewMode: 1,
                background: false,
                autoCrop: false,
                guides: false,
                autoCropArea: '0.2',
                initialAspectRatio: 1,
                zoomOnWheel: false,
                dragMode: 'move'
            })
        }
    }
    render() {
        return (
            <div className="img-scroll-wrap">
                {
                    this.state.imgList.length > 0 ?
                    <div style={{ position: 'relative' }}>
                        <Row type="flex" justify="space-between" style={{ position: 'absolute', left: '50%', bottom: 5, zIndex: 10, marginLeft: -100, width: 200 }}>
                            <Col>
                                <Button type="primary" size="small" onClick={ this.changeImg.bind(this, -1) }><Icon type="left" /></Button>
                            </Col>
                            <Col style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '0 10px' }}>
                                { this.state.imgIndex + 1 } / { this.state.imgList.length }
                            </Col>
                            <Col>
                                <Button type="primary" size="small" onClick={ this.changeImg.bind(this, 1) }><Icon type="right" /></Button>
                            </Col>
                        </Row>
                        <div className="img-scroll">
                            <p className="img-rotate" style={{ width: 300, marginLeft: -150, top: 0 }}>
                                <Icon type="undo" onClick={ this.rotate.bind(this, -1 ) } style={{ cursor: 'pointer' }} title="左旋转" />
                                <Icon type="redo" onClick={ this.rotate.bind(this, 1 ) } style={{ cursor: 'pointer', marginLeft: 10 }} title="右旋转" />
                                <Icon type="zoom-out" onClick={ this.imgScale.bind(this, -1 ) } style={{ cursor: 'pointer', marginLeft: 20 }} title="缩小" />
                                <Icon type="zoom-in" onClick={ this.imgScale.bind(this, 1 ) } style={{ cursor: 'pointer', marginLeft: 20 }} title="放大" />
                                <Icon type="sync" onClick={ this.resetImg } style={{ cursor: 'pointer', marginLeft: 20 }} title="重置图片" />
                                <Icon type="file-image" onClick={ this.originalImg } style={{ cursor: 'pointer', marginLeft: 20 }} title="查看原图" />
                                <Icon type="scan" onClick={ this.doCropper } style={{ cursor: 'pointer', marginLeft: 20 }} title="图片识别" />
                            </p>
                            <div className="img-item" id="imgBox" style={{ height: 300, overflow: 'auto' }}>
                                <img
                                    id="curImg"
                                    ref="image"
                                    src={ this.state.imgSrc }
                                    alt={ this.state.imgSrc }
                                />
                            </div>
                        </div>
                        <p style={{ position: 'absolute', top: -34, right: 0, zIndex: 5, textAlign: 'center' }}>
                            <Button size="small" type="primary" onClick={ this.queryCropper }>开始识别</Button>
                            <Button size="small" style={{ marginLeft: 10 }} onClick={ this.cancelCropper }>取消识别</Button>
                            <Button size="small" style={{ marginLeft: 10 }} type="primary" onClick={ this.croppPic }>原图一键识别</Button>
                        </p>
                    </div> :
                    <div style={{ textAlign: 'center', padding: '30px 0', fontSize: 16, color: '#999' }}>
                        暂无附件
                    </div>
                }
            </div>
        )
    }
    changeImg = flag => {
        let idx = 0;
        if(flag === -1){
            idx = this.state.imgIndex === 0 ? this.state.imgList.length - 1 : this.state.imgIndex - 1
        }else{
            idx = this.state.imgIndex === this.state.imgList.length - 1 ? 0 : this.state.imgIndex + 1
        }
        this.setState({
            imgIndex: idx,
            curImg: this.state.imgList[idx],
            imgSrc: imgServer + this.state.imgList[idx].reduceFileRoute,
			rotateDeg: 0
        }, () => {
            this.myCropper.replace(this.state.imgSrc)
        })
        if(this.props.onChange){
            this.props.onChange(idx)
        }
    }
    rotate = flag => {
        let rotateDeg = this.state.rotateDeg;
        if(flag === 1){
            rotateDeg += 90
        }else{
            rotateDeg += -90
        }
        this.setState({
            rotateDeg
        }, () => {
            this.myCropper.rotateTo(rotateDeg)
        })
    }
    imgScale = flag => {
        let imgScaleRatio = 0
        if(flag === 1){
            imgScaleRatio = 0.4
        }else{
            
            imgScaleRatio = -0.4
        }
        this.myCropper.zoom(imgScaleRatio)
    }

    originalImg = () => {
        if(this.state.imgSrc === imgServer + this.state.curImg.fileRoute){
            return
        }
        this.setState({
            imgSrc: imgServer + this.state.curImg.fileRoute
        }, () => {
            this.myCropper.replace(this.state.imgSrc)
        })
    }
    resetImg = () => {
        this.myCropper.reset()
    }
    doCropper = () => {
        this.myCropper.crop()
    }
    cancelCropper = () => {
        this.myCropper.clear()
    }
    queryCropper = () => {
        let cropData = this.myCropper.getCropBoxData();
        if(!cropData.width){
            message.error('请选取识别区域')
            return
        }
        this.myCropper.getCroppedCanvas().toBlob(blob => {
            this.props.onCropper(blob)
        })
    }
    croppPic = () => {
        utils.showLoading()
        let canvas = document.createElement('CANVAS');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = imgServer + this.state.curImg.fileRoute;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            let dataurl = canvas.toDataURL('image/jpeg', 1.0);
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            let blob = new Blob([u8arr], {type:mime});
            this.props.onCropper(blob)
        };
    }
}
export default ImgScroll;