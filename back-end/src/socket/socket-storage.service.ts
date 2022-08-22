import { Injectable } from '@nestjs/common';
import { UserContext } from './class/user.class';

@Injectable()
export class SocketStorageService {
  private userContexts: Map<string, UserContext> = new Map(); // key: socketId

  private usersSocket: Map<string, string> = new Map(); // key: userId, value: socketId

  getUserContext(socketId: string): UserContext {
    return this.userContexts.get(socketId);
  }

  getUserContextSize(): number {
    return this.userContexts.size;
  }

  getUserSocket(userId: string): string {
    return this.usersSocket.get(userId);
  }

  setUserContext(socketId: string, userContext: UserContext) {
    this.userContexts.set(socketId, userContext);
  }

  setUserSocket(userId: string, socketId: string) {
    this.usersSocket.set(userId, socketId);
  }

  removeUserContext(socketId: string) {
    this.userContexts.delete(socketId);
  }

  removeUserSocket(userId: string) {
    this.usersSocket.delete(userId);
  }
}
