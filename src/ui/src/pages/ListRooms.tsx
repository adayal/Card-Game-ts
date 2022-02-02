import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { WebSocketContext } from "../WebSocket";


class ListRooms extends React.Component<any> {
    rooms = useState([])
    dispatch = useDispatch();
    ws = useContext(WebSocketContext);

    getRooms = () => {
        if (this.ws) {
            this.ws.getRooms()
        }
    }

    render() {
        useEffect(() => {

        })
        return (
            <div>

            </div>
        );
    }
}

export default ListRooms;