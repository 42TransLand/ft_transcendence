// 게임 상에서 사용되는 상수들을 정의합니다.

// 게임 화면의 가로 크기 입니다.
const GAME_SCREEN_WIDTH = 1920;

// 게임 화면의 세로 크기 입니다.
const GAME_SCREEN_HEIGHT = 1080;

// 게임 화면의 객체의 기준이 되는 크기 단위 입니다.
const GAME_SCREEN_UNIT = 15;

// 게임 화면에서 중앙 선 각각 하나의 크기 입니다.
const MIDDLE_LINE_SIZE = { x: GAME_SCREEN_UNIT, y: GAME_SCREEN_UNIT * 2 };

// 게임 화면에서 중앙 선 각각의 거리 크기 입니다.
const MIDDLE_LINE_GAP = GAME_SCREEN_UNIT * 1.5;

const PLAYER_RACKET_INIT_X_POS = 60;
const PLAYER_RACKET_WIDTH = 20;
const PLAYER_RACKET_HEIGHT = 175;
const PLAYER_RACKET_INIT_POS = [
  { x: PLAYER_RACKET_INIT_X_POS, y: 0 },
  { x: GAME_SCREEN_WIDTH - PLAYER_RACKET_INIT_X_POS, y: 0 },
];
const PLAYER_RACKET_MOVE_SPEED = 20;
const PLAYER_SCORE_POS = [
  { x: GAME_SCREEN_WIDTH / 2 - 250, y: 100 },
  { x: GAME_SCREEN_WIDTH / 2 + 250, y: 100 },
];
const PLAYER_SCORE_PIVOT = [
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];
const PLAYER_SCORE_FONT_STYLE = {
  fontFamily: 'Bit5x3',
  fontSize: 250,
  fill: 'white',
  align: 'center',
};

const BALL_RADIUS = 20;

export {
  GAME_SCREEN_WIDTH,
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_UNIT,
  MIDDLE_LINE_SIZE,
  MIDDLE_LINE_GAP,
  PLAYER_RACKET_INIT_POS,
  PLAYER_RACKET_MOVE_SPEED,
  PLAYER_RACKET_WIDTH,
  PLAYER_RACKET_HEIGHT,
  PLAYER_SCORE_POS,
  PLAYER_SCORE_FONT_STYLE,
  PLAYER_SCORE_PIVOT,
  BALL_RADIUS,
};
