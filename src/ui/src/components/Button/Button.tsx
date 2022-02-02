import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    name: string;
    route: string;
}

export class Button extends React.Component<Props> {

    render() {
        return (
            <Link to={this.props.route}>
                <button>
                    {this.props.name}
                </button>
            </Link>
        );
    }
}

export default Button;