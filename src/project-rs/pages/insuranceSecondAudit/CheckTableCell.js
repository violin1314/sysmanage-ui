import React, { Component } from 'react';
import { Input, Icon } from 'antd';

class EditableCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            editable: false
        }
    }
    handleChange = e => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div style={{ lineHeight: '32px' }}>
                {
                    editable ?
                    <div>
                        <Input
                            value={value}
                            onChange={ this.handleChange }
                            onPressEnter={ this.check }
                            style={{ display: 'inline-block', width: 500 }}
                        />
                        <Icon
                            type="check"
                            style={{ marginLeft: 10 }}
                            onClick={ this.check }
                        />
                    </div>
                    :
                    <div>
                        {value || ' '}
                        <Icon
                            type="edit"
                            style={{ marginLeft: 10 }}
                            onClick={ this.edit }
                        />
                    </div>
                }
            </div>
        );
    }
}
export default EditableCell