import CONSTANTS from "../../../common/CONSTANTS";

function updateRoomList(roomList: any) {
    return {
        type: CONSTANTS.CLIENT_ACTIONS.UPDATE_ROOM_LIST,
        roomList
    }
}

function createGenericMessage(commandName: string, objectType: string, objectData: any) {
    return {
        commandName: commandName,
        objectType: objectType,
        objectData: objectData
    };
}

const _ = {
    updateRoomList,
    createGenericMessage
}

export default _;