enum SocketEventName {
  GAME_CREATE_REQ = 'game-create-req',
  GAME_ENQUEUE_MATCH_REQ = 'game-enqueue-match-req',
  GAME_JOIN_REQ = 'game-join-req',
  GAME_LEAVE_REQ = 'game-leave-req',
  PLAYER_MOVE_REQ = 'player-move-req',

  GAME_INVITE_REQ = 'game-invite-req',
  GAME_ACCEPT_REQ = 'game-accept-req',
  GAME_REFUSE_REQ = 'game-refuse-req',

  BALL_MOVE_NOTIFY = 'ball-move-notify',
  GAME_CREATE_RES = 'game-create-res',
  GAME_END_NOTIFY = 'game-end-notify',
  GAME_ENQUEUE_MATCH_RES = 'game-enqueue-match-res',
  GAME_JOIN_RES = 'game-join-res',
  GAME_READY_NOTIFY = 'game-ready-notify',
  GAME_SCORE_NOTIFY = 'game-score-notify',
  GAME_STATE_NOTIFY = 'game-state-notify',
  PLAYER_MOVE_NOTIFY = 'player-move-notify',

  GAME_INVITE_RES = 'game-invite-res',
  GAME_ACCEPT_RES = 'game-accept-res',
  GAME_REFUSE_RES = 'game-refuse-res',
  GAME_INVITE_NOTIFY = 'game-invite-notify',
}

export default SocketEventName;
