import * as React from 'react';
import { Button } from '../Button/Button'

class MenuArea extends React.Component {
    public render() {
        return (
            <div>
                <Button route="/create" name="Create Room"/>
                <Button route="/join" name="Join Room"/>
            </div>
        );
    }
}

export default MenuArea