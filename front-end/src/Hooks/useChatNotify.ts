import React from 'react';
import ChannelType from '../Props/ChannelType';
import ChatMemberRole from '../Props/ChatMemberRole';
import useMe from './useMe';
import useMessage from './useMessage';
import { useSocket } from './useSocket';
import SocketEventName from '../WebSockets/dto/constants/socket.events.enum';
import ChatJoinNotifyProps from '../WebSockets/dto/res/chat.join.notify.dto';
import ChatLeaveNotifyProps from '../WebSockets/dto/res/chat.leave.notify.dto';
import ChatMessageProps from '../WebSockets/dto/res/chat.message.notify.dto';
import ChatUpdateProtectionNotifyProps from '../WebSockets/dto/res/chat.update.protection.notify.dto';
import ChatUpdateUserNotifyProps from '../WebSockets/dto/res/chat.update.user.notify.dto';
import ChatUserUpdate from '../WebSockets/dto/constants/chat.user.update.enum';
import useBlocks from './useBlocks';

export default function useChatNotify() {
  const { state } = useSocket();
  const {
    dispatchChat,
    insertRoomMember,
    deleteRoomMember,
    dispatchRoomProtection,
    updateRoomMember,
  } = useMessage();
  const { nickname: myNickname } = useMe();
  const blocks = useBlocks();
  React.useEffect(() => {
    state.socket?.on(
      SocketEventName.CHAT_JOIN_NOTIFY,
      (joinedMember: ChatJoinNotifyProps) => {
        insertRoomMember({
          profileImg: `${process.env.REACT_APP_API_HOST}/${joinedMember.profileImg}`,
          userId: joinedMember.id,
          name: joinedMember.nickname,
          role: ChatMemberRole.MEMBER,
          muted: false,
          blocked: false,
        });
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_LEAVE_NOTIFY,
      (leavingMember: ChatLeaveNotifyProps) => {
        deleteRoomMember(leavingMember.nickname);
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_MESSAGE_NOTIFY,
      (sendMember: ChatMessageProps) => {
        if (sendMember.nickname !== myNickname) {
          if (
            blocks.filter((block) => block.nickname === sendMember.nickname)
              .length === 0
          ) {
            dispatchChat(sendMember.nickname, sendMember.content);
          }
        }
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY,
      (modifiedChannel: ChatUpdateProtectionNotifyProps) => {
        dispatchRoomProtection(
          modifiedChannel.status ? ChannelType.PUBLIC : ChannelType.PROTECT,
        );
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_UPDATE_USER_NOTIFY,
      (updatedMember: ChatUpdateUserNotifyProps) => {
        switch (updatedMember.type) {
          case ChatUserUpdate.KICK || ChatUserUpdate.BAN: {
            deleteRoomMember(updatedMember.nickname);
            if (updatedMember.nickname === myNickname) {
              window.location.href = `http://${window.location.host}`;
            }
            break;
          }
          case ChatUserUpdate.MUTE: {
            updateRoomMember({
              userId: updatedMember.id,
              muted: updatedMember.status,
            });
            break;
          }
          case ChatUserUpdate.ADMIN: {
            updateRoomMember({
              userId: updatedMember.id,
              role: updatedMember.status
                ? ChatMemberRole.ADMIN
                : ChatMemberRole.MEMBER,
            });
            break;
          }
          case ChatUserUpdate.OWNER: {
            updateRoomMember({
              userId: updatedMember.id,
              role: ChatMemberRole.OWNER,
            });
            break;
          }
          default:
            break;
        }
      },
    );
    return () => {
      state.socket?.off(SocketEventName.CHAT_JOIN_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_LEAVE_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_MESSAGE_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_UPDATE_USER_NOTIFY);
    };
  }, [
    deleteRoomMember,
    dispatchChat,
    dispatchRoomProtection,
    insertRoomMember,
    myNickname,
    state.socket,
    updateRoomMember,
    blocks,
  ]);
}
