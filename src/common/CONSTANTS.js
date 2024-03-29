export default Object.freeze({
    GAMES_LOADED: {
        SAATH_AATH: 'SAATH_AATH'
    },
    MSG_TYPES: {
        JOIN_ROOM: 'JOIN_ROOM',
        LIST_ROOMS: 'LIST_ROOMS',
        DISCONNECT: 'DISCONNECT',
        PLAY_CARD: 'PLAY_CARD',
        START_GAME: 'START_GAME',
        SEND_CHAT_MSG: 'SEND_CHAT_MSG',
        RECIEVE_CHAT_MSG: 'RECIEVE_CHAT_MSG',
        NOT_CONNECTED: 'NOT_CONNECTED',
        GET_ROOMS: 'GET_ROOMS',
        SEND_ROOMS: 'SEND_ROOMS',
        ROOM_ALREADY_EXISTS: 'ROOM_ALREADY_EXISTS',
        ROOM_CREATED: 'ROOM_CREATED',
        ROOM_NOT_CREATED: 'ROOM_NOT_CREATED',
        ROOM_NOT_JOINED: 'ROOM_NOT_JOINED',
        CREATE_ROOM: 'CREATE_ROOM',
        ALREADY_JOINED_ROOM: 'ALREADY_JOINED_ROOM',
        WRONG_PASSWORD: 'WRONG_PASSWORD'

    },
    GAME_ACTIONS: {
        JOIN_GAME: "JOIN_GAME",
        LEAVE_GAME: "LEAVE_GAME",
        CREATE_GAME: "CREATE_GAME"
    },
    ACTIONS: {
        CHAT_ACTION: "CHAT_ACTION",
        GAME_ACTION: "GAME_ACTION",
        PLAYER_MOVE_ACTION: "PLAYER_MOVE_ACTION",
        UPDATE_PLAYER: "UPDATE_PLAYER"
    },
    CHAT_STATES: {
        TYPING: 'TYPING',
        STOP_TYPING: 'STOP_TYPING',
        SEND_MESSAGE: 'SEND_MESSAGE'
    },
    CLIENT_MSG: {
        ERROR_GAME_NOT_LOADED: "ERROR_GAME_NOT_LOADED",
        GENERIC_ERROR: "GENERIC_ERROR",
        ERROR_ILLEGAL_MOVE: "ERROR_ILLEGAL_MOVE",
        ACKNOWLEDGED: "ACKNOWLEDGED",
        ALREADY_PLAYER: "ALREADY_PLAYER",
        NOT_A_PLAYER: "NOT_A_PLAYER",
        GAME_ALREADY_STARTED: "GAME_ALREADY_STARTED",
        KICK_GAME_TERMINATE: "KICK_GAME_TERMINATE",
        CARD_NOT_FOUND: "CARD_NOT_FOUND",
        CANNOT_PLAY_CARD: "CANNOT_PLAY_CARD",
        CANNOT_FIND_DESTINATION: "CANNOT_FIND_DESTINATION",
        PICK_TRUMP: "PICK_TRUMP",
        PICKED_TRUMP: "PICKED_TRUMP",
        NO_WINNER: "NO_WINNER",
        WINNER: "WINNER",
        LOCAL_WINNER: "LOCAL_WINNER",
        LOSER: "LOSER", 
        LOCAL_LOSER: "LOCAL_LOSER",
        SEND_CURRENT_HAND: "SEND_CURRENT_HAND",
        DO_ACTION: "DO_ACTION",
        YOUR_TURN: "YOUR_TURN",
        ACKNOWLEDGED_LIST_ROOM: "ACKNOWLEDGED_LIST_ROOM"
    },
    POSSIBLE_ACTIONS: {
        PLAY_CARD: "PLAY_CARD",
        REQUEST_CARD: "REQUEST_CARD",
        RESIGN: "RESIGN",
        OFFER_RESTART: "OFFER_RESTART"
    },
    MAX_CARD_NUMBER: 13,
    CARD_TYPES: {
        CLUB: "CLUB",
        DIAMOND: "DIAMOND",
        HEART: "HEART",
        SPADE: "SPADE"
    },
    LOCALSTORAGE: {
        GET_USERNAME: "GET_USERNAME"
    },
    APP_PATH: {
        LIST_ROOMS: 'listRooms',
        CREATE_ROOM: 'createRoom',
        SOCKET_PATH: "http://localhost:3001/"
    },
    CLIENT_ACTIONS: {
        UPDATE_ROOM_LIST: 'UPDATE_ROOM_LIST'
    },
    APP_COMMANDS: {
        NULL_COMMAND: "NULL"
    }
  });