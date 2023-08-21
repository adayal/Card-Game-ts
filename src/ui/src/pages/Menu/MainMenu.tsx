import * as React from 'react';
import StyledPageContainer from '../StyledPageContainer';
import MenuArea from '../../components/MenuArea/MenuArea'

/*
 if game already joined, show the game
    else show the main menu to create/join game
*/
export const MainMenu = () => {
    <StyledPageContainer>
        <MenuArea />
    </StyledPageContainer>
}