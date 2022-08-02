import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    name: string;
    route?: string;
    onclick?: any;
}

export class Button extends React.Component<Props> {
    render() {
        return (
            <button onClick={this.props.onclick}>
                {this.props.name}
            </button>
        );
    }
}