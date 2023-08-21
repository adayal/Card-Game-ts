import React, { createContext } from 'react'
import io from 'socket.io-client'
import { useDispatch } from 'react-redux'
import CONSTANTS from '../../common/CONSTANTS';
import actions from './actions/Actions'


const WebSocketContext = createContext(null);

export { WebSocketContext }

export default ({children}) => {
    let socket;
    let ws;
    const dispatch = useDispatch();

    const getRooms = () => {
        let message = actions.createGenericMessage(CONSTANTS.MSG_TYPES.LIST_ROOMS, "ListRoomModel", {});
        socket.emit("message", JSON.stringify(message));
    }

    if (!socket) {
        socket = io("localhost:3001")
        socket.on(CONSTANTS.CLIENT_MSG.ACKNOWLEDGED_LIST_ROOM, (msg) => {
            const payload = JSON.parse(msg);
            dispatch(actions.updateRoomList(payload));
        });

        ws = {
            socket: socket,
            getRooms
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
}