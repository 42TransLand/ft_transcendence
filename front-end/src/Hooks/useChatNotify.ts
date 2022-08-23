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

export default function useChatNotify() {
  const { state } = useSocket();
  const {
    dispatchChat,
    insertRoomMember,
    deleteRoomMember,
    dispatchRoomProtection,
    updateRoomMember,
    updateMemberRole,
  } = useMessage();
  const { nickname: myNickname } = useMe();
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
      (joinedMember: ChatLeaveNotifyProps) => {
        deleteRoomMember(joinedMember.nickname);
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_MESSAGE_NOTIFY,
      (joinedMember: ChatMessageProps) => {
        if (joinedMember.nickname !== myNickname) {
          dispatchChat(joinedMember.nickname, joinedMember.content);
        }
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY,
      (joinedMember: ChatUpdateProtectionNotifyProps) => {
        dispatchRoomProtection(
          joinedMember.status ? ChannelType.PUBLIC : ChannelType.PROTECT,
        );
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_UPDATE_USER_NOTIFY,
      (updatedMember: ChatUpdateUserNotifyProps) => {
        if (
          updatedMember.type === ChatUserUpdate.KICK ||
          updatedMember.type === ChatUserUpdate.BAN
        ) {
          if (updatedMember.nickname === myNickname) {
            window.location.href = `http://${window.location.host}`;
          }
        } else if (updatedMember.type === ChatUserUpdate.ADMIN) {
          updateMemberRole(updatedMember.nickname);
        }
      },
    );
    return () => {
      state.socket?.off(SocketEventName.CHAT_JOIN_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_LEAVE_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_MESSAGE_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY);
    };
  }, [
    deleteRoomMember,
    dispatchChat,
    dispatchRoomProtection,
    insertRoomMember,
    myNickname,
    state.socket,
    updateMemberRole,
    updateRoomMember,
  ]);
}
