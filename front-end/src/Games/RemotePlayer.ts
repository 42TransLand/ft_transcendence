import AbstractPlayer from './AbstractPlayer';

export default class RemotePlayer extends AbstractPlayer {
  public constructor(index: number) {
    super(index);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public update(delta: number) {}
}
