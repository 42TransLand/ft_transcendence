import { Socket } from 'socket.io';

export class Player {
  private score = 0;

  constructor(
    public readonly socket: Socket,
    public readonly id: number,
    public readonly x: number,
    public readonly y: number,
  ) {}
}
