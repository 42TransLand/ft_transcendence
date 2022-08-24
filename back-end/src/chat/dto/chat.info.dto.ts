import { ChatType } from '../constants/chat.type.enum';

export class ChatInfoDto {
  id: string;

  name: string;

  type: ChatType;

  createdAt: Date;

  updateAt: Date;

  count: number;
}
