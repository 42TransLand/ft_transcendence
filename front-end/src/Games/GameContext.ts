import * as PIXI from 'pixi.js';
import { Socket } from 'socket.io-client';
import AbstractPlayer from './AbstractPlayer';
import Ball from './Ball';
import Decoration from './Decoration';
import BaseResultDto from './dto/base.result.dto';
import {
  GAME_SCREEN_WIDTH,
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_UNIT,
  MIDDLE_LINE_SIZE,
  MIDDLE_LINE_GAP,
  SocketEventName,
} from './dto/constants/game.constants';
import GameState from './dto/constants/game.state.enum';
import BallMoveNotifyDto from './dto/res/ball.move.notify.dto';
import GameCreateResDto from './dto/res/game.create.res.dto';
import GameEndNotifyDto from './dto/res/game.end.notify.dto';
import GameJoinResDto from './dto/res/game.join.res.dto';
import GameReadyNotifyDto from './dto/res/game.ready.notify.dto';
import GameScoreNotifyDto from './dto/res/game.score.notify.dto';
import GameStateNotifyDto from './dto/res/game.state.notify.dto';
import PlayerMoveNotifyDto from './dto/res/player.move.notify.dto';
import InputManager from './InputManager';
import LocalPlayer from './LocalPlayer';
import RemotePlayer from './RemotePlayer';

export default class GameContext {
  private app: PIXI.Application;

  private input: InputManager;

  private players: (AbstractPlayer | null)[] = [];

  private ball: Ball;

  private localIndex: number = 0;

  private remoteIndex: number = 1;

  private gameMode: string | null = null;

  private ladder = false;

  private scoreForWin = 0;

  private readonly decorations: Decoration[] = [];

  private readonly hudMessage: PIXI.Text;

  constructor(
    public readonly socket: Socket,
    public readonly searchParams: URLSearchParams,
  ) {
    this.app = new PIXI.Application({
      width: GAME_SCREEN_WIDTH,
      height: GAME_SCREEN_HEIGHT,
      backgroundColor: 0x000000,
    });
    this.initDecorations();
    this.initHandlers();
    this.app.view.style.maxWidth = '100vw';
    this.app.view.style.maxHeight = '100vh';
    this.app.view.style.height = '100%';
    this.input = new InputManager(this.app.view);
    this.ball = new Ball();
    this.hudMessage = new PIXI.Text('Waiting other player...', {
      dropShadowColor: 'white',
      fillGradientType: 1,
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      fontSize: 100,
      lineJoin: 'bevel',
      miterLimit: 25,
      stroke: 'white',
      strokeThickness: 7,
    });
    this.hudMessage.position = new PIXI.Point(
      GAME_SCREEN_WIDTH / 2,
      GAME_SCREEN_HEIGHT / 2,
    );
    this.hudMessage.anchor.x = 0.5;
    this.hudMessage.anchor.y = 0.5;
    this.app.stage.addChild(this.hudMessage);

    if (!searchParams.has('mode')) this.hudMessage.text = 'INVALID ACCESS :(';
  }

  public get view() {
    return this.app.view;
  }

  public onComponentDidMount() {
    this.app.view.onclick = this.input.requestPointerLock;
    this.app.ticker.add(this.input.update);
    this.input.onComponentDidMount();
  }

  public onComponentWillUnmount() {
    this.app.view.onclick = null;
    this.app.ticker.remove(this.input.update);
    this.input.onComponentWillUnmount();
    this.socket.emit(SocketEventName.GAME_LEAVE_REQ);
  }

  private displayHud(reason: string) {
    this.hudMessage.text = reason;
  }

  public send(eventName: string, message: any) {
    this.socket.emit(eventName, message);
  }

  private initDecorations() {
    // 상하좌우 테두리 선 오브젝트들을 추가합니다.
    // 상단 선
    this.decorations.push(
      new Decoration(0, 0, GAME_SCREEN_WIDTH, GAME_SCREEN_UNIT, 0, 0),
    );
    // 좌측 선
    this.decorations.push(
      new Decoration(0, 0, GAME_SCREEN_UNIT, GAME_SCREEN_HEIGHT, 0, 0),
    );
    // 하단 선
    this.decorations.push(
      new Decoration(
        0,
        GAME_SCREEN_HEIGHT,
        GAME_SCREEN_WIDTH,
        GAME_SCREEN_UNIT,
        0,
        1,
      ),
    );
    // 우측 선
    this.decorations.push(
      new Decoration(
        GAME_SCREEN_WIDTH,
        GAME_SCREEN_HEIGHT,
        GAME_SCREEN_UNIT,
        GAME_SCREEN_HEIGHT,
        1,
        1,
      ),
    );

    // 중앙 눈금 오브젝트들을 추가합니다.
    // 반복문으로 중앙에 눈금 객체들을 추가.
    for (
      let i = 0;
      i < GAME_SCREEN_HEIGHT;
      i += MIDDLE_LINE_SIZE.y + MIDDLE_LINE_GAP
    ) {
      this.decorations.push(
        new Decoration(
          GAME_SCREEN_WIDTH / 2,
          i,
          MIDDLE_LINE_SIZE.x,
          MIDDLE_LINE_SIZE.y,
          0.5,
          0,
        ),
      );
    }
  }

  private addDecorations() {
    this.app.stage.addChild(...this.decorations.map((d) => d.displayObject));
    this.decorations.forEach((d) => d.render());
  }

  private removeDecorations() {
    this.decorations.forEach((d) => d.undraw());
    this.app.stage.removeChild(...this.decorations.map((d) => d.displayObject));
  }

  private initHandlers() {
    this.onBallMove = this.onBallMove.bind(this);
    this.onGameCreateRes = this.onGameCreateRes.bind(this);
    this.onGameEndNotify = this.onGameEndNotify.bind(this);
    this.onGameEnqueueMatchRes = this.onGameEnqueueMatchRes.bind(this);
    this.onGameJoinRes = this.onGameJoinRes.bind(this);
    this.onGameReadyNotify = this.onGameReadyNotify.bind(this);
    this.onGameScoreNotify = this.onGameScoreNotify.bind(this);
    this.onGameStateNotify = this.onGameStateNotify.bind(this);
    this.onPlayerMoveNotify = this.onPlayerMoveNotify.bind(this);

    this.socket.on(SocketEventName.BALL_MOVE_NOTIFY, this.onBallMove);
    this.socket.on(SocketEventName.GAME_CREATE_RES, this.onGameCreateRes);
    this.socket.on(SocketEventName.GAME_END_NOTIFY, this.onGameEndNotify);
    this.socket.on(SocketEventName.GAME_JOIN_RES, this.onGameJoinRes);
    this.socket.on(SocketEventName.GAME_READY_NOTIFY, this.onGameReadyNotify);
    this.socket.on(SocketEventName.GAME_SCORE_NOTIFY, this.onGameScoreNotify);
    this.socket.on(SocketEventName.GAME_STATE_NOTIFY, this.onGameStateNotify);
    this.socket.on(SocketEventName.PLAYER_MOVE_NOTIFY, this.onPlayerMoveNotify);

    this.socket.on(
      SocketEventName.GAME_ENQUEUE_MATCH_RES,
      this.onGameEnqueueMatchRes,
    );
  }

  private onBallMove(msg: BallMoveNotifyDto) {
    this.ball.onBallMove(msg);
  }

  private onGameCreateRes(msg: GameCreateResDto) {
    // 게임 정보를 서버로부터 받음 : 게임 모드, 플레이어 인덱스
    this.localIndex = msg.myIndex;
    this.remoteIndex = 1 - msg.myIndex;
    this.gameMode = msg.gameMode;
    this.ladder = msg.ladder;
    this.scoreForWin = msg.scoreForWin;
  }

  private onGameEndNotify(msg: GameEndNotifyDto) {
    this.displayHud(`Winner: Player${msg.winnerIndex + 1}`);
  }

  private onGameEnqueueMatchRes(msg: BaseResultDto) {
    if (!msg.success) {
      this.displayHud(`${msg.error}`);
    }
  }

  private onGameJoinRes(msg: GameJoinResDto) {
    // 게임 정보를 서버로부터 받음 : 게임 모드, 플레이어 인덱스
    this.localIndex = msg.myIndex;
    this.remoteIndex = 1 - msg.myIndex;
    this.gameMode = msg.gameMode;
    this.ladder = msg.ladder;
    this.scoreForWin = msg.scoreForWin;
  }

  private onGameReadyNotify(msg: GameReadyNotifyDto) {
    if (msg.readyCountDown === 0) this.displayHud('GAME START!');
    else this.displayHud(`Ready: ${msg.readyCountDown}`);
  }

  private onGameScoreNotify(msg: GameScoreNotifyDto) {
    this.players[msg.playerIndex]?.onScore(msg);
  }

  private onGameStateNotify(msg: GameStateNotifyDto) {
    if (msg.state === GameState.READY) {
      this.removeDecorations();
      this.deactivateGame();
    }
    if (msg.state === GameState.PLAYING) {
      this.addDecorations();
      this.activateGame();
    }
    if (msg.state === GameState.ENDED) {
      this.removeDecorations();
      this.deactivateGame();
    }
  }

  private onPlayerMoveNotify(msg: PlayerMoveNotifyDto) {
    this.players[msg.playerIndex]?.onMove(msg);
  }

  private activateGame() {
    // 로컬 플레이어 객체 생성
    const localPlayer = new LocalPlayer(
      this.input,
      this.socket,
      this.localIndex,
    );
    // 원격 플레이어 객체 생성
    const remotePlayer = new RemotePlayer(this.remoteIndex);

    this.players[this.localIndex] = localPlayer;
    this.players[this.remoteIndex] = remotePlayer;

    // 게임 엔진에 로컬 플레이어 객체들 추가
    this.app.stage.addChild(...localPlayer.displayObjects);
    // 게임 엔진에 원격 플레이어 객체들 추가
    this.app.stage.addChild(...remotePlayer.displayObjects);
    // 게임 엔진에 공 객체 추가
    this.app.stage.addChild(this.ball.displayObject);

    this.ball.render();

    this.players
      .filter((p) => p !== null)
      .forEach((p) => this.app.ticker.add(p!.update));

    this.hudMessage.text = '';
  }

  private deactivateGame() {
    this.players.forEach((p) => {
      if (p) {
        p.undraw();
        this.app.stage.removeChild(...p.displayObjects);
        this.app.ticker.remove(p.update);
      }
    });
    this.app.stage.removeChild(this.ball.displayObject);
    this.ball.undraw();
  }
}
