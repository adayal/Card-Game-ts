import * as React from 'react';

class Button extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            value: null,
        };
    }
    render() {
        return (
            <button>
                {this.props.helpMe}
            </button>
        );
    }
}