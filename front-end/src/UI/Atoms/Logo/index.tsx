import * as PIXI from 'pixi.js';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const GameView = styled.div`
  width: 100vw;
  height: 100vh;
  /* width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none; */
`;
const LogoImg = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 50%;
  height: 20%;
  margin: auto;
  z-index: 2;
`;

interface GameContext {
  radius: number;
  app: PIXI.Application;
}

class Ball {
  private graphic: PIXI.Graphics;

  private pos: PIXI.Point;

  private vel: PIXI.Point;

  constructor(private context: GameContext) {
    this.graphic = new PIXI.Graphics();
    this.pos = new PIXI.Point(
      this.context.app.screen.width / 2,
      this.context.app.screen.height / 2,
    );
    this.vel = new PIXI.Point(-15, -10);
    this.update = this.update.bind(this);
    this.draw = this.draw.bind(this);
  }

  public getGraphic() {
    return this.graphic;
  }

  public update(delta: number): void {
    const newPos = this.pos.clone();
    const boundary = {
      l: this.context.radius,
      r: this.context.app.screen.width - this.context.radius,
      t: this.context.radius,
      b: this.context.app.screen.height - this.context.radius,
    };
    newPos.x += this.vel.x * delta;
    newPos.y += this.vel.y * delta;
    if (newPos.x < boundary.l) {
      newPos.x = boundary.l;
      this.vel.x *= -1;
    } else if (newPos.x > boundary.r) {
      newPos.x = boundary.r;
      this.vel.x *= -1;
    }
    if (newPos.y < boundary.t) {
      newPos.y = boundary.t;
      this.vel.y *= -1;
    } else if (newPos.y > boundary.b) {
      newPos.y = boundary.b;
      this.vel.y *= -1;
    }
    this.pos = newPos;
    this.draw();
  }

  private draw(): void {
    this.graphic.clear();
    this.graphic.beginFill(0xffffff);
    this.graphic.drawCircle(this.pos.x, this.pos.y, this.context.radius);
    this.graphic.endFill();
  }
}

export default function Logo() {
  const context: GameContext = React.useMemo(
    () => ({
      radius: 15,
      app: new PIXI.Application({
        width: 1920,
        height: 1080,
        backgroundColor: 0x000000,
      }),
    }),
    [],
  );
  React.useEffect(() => {
    const ball = new Ball(context);
    context.app.stage.addChild(ball.getGraphic());
    context.app.ticker.add(ball.update);
    context.app.view.style.maxWidth = '100%';
    context.app.view.style.maxHeight = '100%';
    context.app.view.style.width = 'inherit';
    context.app.view.style.position = 'absolute';
    context.app.view.style.top = '0';
    context.app.view.style.bottom = '0';
    context.app.view.style.left = '0';
    context.app.view.style.right = '0';
    context.app.view.style.margin = 'auto';
    context.app.view.style.objectFit = 'contain';
    document.getElementById('game-view')?.appendChild(context.app.view);
    return () => {
      document.getElementById('game-view')?.removeChild(context.app.view);
      context.app.destroy(true);
    };
  }, [context]);

  return (
    <Container>
      <GameView id="game-view" />
      <LogoImg src="logo.svg" alt="Atomic Pong" />
    </Container>
  );
}
