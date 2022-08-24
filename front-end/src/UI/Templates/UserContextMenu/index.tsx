/* eslint-disable no-bitwise */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  MenuList,
  MenuItem,
  MenuDivider,
  EventListenerEnv,
} from '@chakra-ui/react';
import {
  FaUserCircle,
  FaUserEdit,
  FaUserPlus,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa';
import { GiBootKick, GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { TbCrown, TbCrownOff } from 'react-icons/tb';
import styled from 'styled-components';
import { ContextMenu } from '../../Organisms/ContextMenu';
import InviteGameMenu from '../../Molecules/InviteGameMenu';
import SpectateMenu from '../../Molecules/SpectateMenu';
import FriendMenu from '../../Molecules/FriendMenu';
import BlockMenu from '../../Molecules/BlockMenu';
import BanMenu from '../../Molecules/BanMenu';
import { TargetUserProvider } from '../../../Hooks/useTargetUser';
import MuteMenu from '../../Molecules/MuteMenu';
import AdminApproveMenu from '../../Molecules/AdminApproveMenu';
import LogoutMenu from '../../Molecules/LogoutMenu';
import useFriends from '../../../Hooks/useFriends';
import { useSocket } from '../../../Hooks/useSocket';
import UserState from '../../../WebSockets/dto/constants/user.state.enum';
import ChatMemberProps from '../../../Props/ChatMemberProps';
import ChatMemberRole from '../../../Props/ChatMemberRole';
import KickMenu from '../../Molecules/KickMenu';
import useBlocks from '../../../Hooks/useBlocks';

export type UserContextMenuType = 'friend' | 'chat' | 'self';

enum UserContextMenuFlag {
  PROFILE = 1 << 0,
  OTP_SETTING = 1 << 1,
  FRIEND_ADD = 1 << 2,
  BLOCK_ADD = 1 << 3,
  BLOCK_REMOVE = 1 << 4,
  GAME_INVITE = 1 << 5,
  GAME_SPECTATE = 1 << 6,
  CHAT_KICK = 1 << 7,
  CHAT_BAN = 1 << 8,
  CHAT_MUTE = 1 << 9,
  CHAT_UNMUTE = 1 << 10,
  ADMIN_APPROVE = 1 << 11,
  ADMIN_UNAPPROVE = 1 << 12,
  LOGOUT = 1 << 13,

  FRIEND = FRIEND_ADD | BLOCK_ADD | BLOCK_REMOVE,
  GAME = GAME_INVITE | GAME_SPECTATE,
  CHAT = CHAT_KICK |
    CHAT_BAN |
    CHAT_MUTE |
    CHAT_UNMUTE |
    ADMIN_APPROVE |
    ADMIN_UNAPPROVE,
}

const ChildView = styled.div`
  width: 100%;
`;

const flagContext = React.createContext<UserContextMenuFlag>(0);

function UserContextMenuItem({
  flag,
  children,
}: {
  flag: UserContextMenuFlag;
  children: JSX.Element;
}) {
  const currentFlag = React.useContext(flagContext);
  return currentFlag & flag ? children : null;
}

export default function UserContextMenu({
  userId,
  name,
  role,
  muted,
  mode,
  children,
  env,
  me,
}: {
  userId: string;
  name: string;
  role?: ChatMemberRole;
  muted?: boolean;
  mode: UserContextMenuType;
  children: React.ReactNode;
  env?: EventListenerEnv;
  me?: ChatMemberProps | undefined;
}) {
  const { state } = useSocket();
  const friends = useFriends();
  const blocks = useBlocks();
  const friendState = state.friendState[userId];
  const menuFlag = React.useMemo(() => {
    let flag = UserContextMenuFlag.PROFILE;
    if (mode === 'self') {
      flag |= UserContextMenuFlag.OTP_SETTING;
      flag |= UserContextMenuFlag.LOGOUT;
    } else {
      const isFriend = friends.filter((f) => f.id === userId).length > 0;
      const isBlocked = blocks.filter((b) => b.id === userId).length > 0;
      if (mode === 'chat') {
        if (name === me?.name) return flag;
        if (
          me?.role === ChatMemberRole.OWNER ||
          (me?.role === ChatMemberRole.ADMIN && role === ChatMemberRole.MEMBER)
        ) {
          flag |= UserContextMenuFlag.CHAT_KICK;
          flag |= UserContextMenuFlag.CHAT_BAN;
          if (muted) {
            flag |= UserContextMenuFlag.CHAT_UNMUTE;
          } else {
            flag |= UserContextMenuFlag.CHAT_MUTE;
          }
        }
        if (me?.role === ChatMemberRole.OWNER) {
          if (role === ChatMemberRole.ADMIN) {
            flag |= UserContextMenuFlag.ADMIN_UNAPPROVE;
          } else {
            flag |= UserContextMenuFlag.ADMIN_APPROVE;
          }
        }
        flag |= UserContextMenuFlag.GAME_INVITE;
      }
      if (!isFriend) {
        flag |= UserContextMenuFlag.FRIEND_ADD;
      }
      if (isBlocked) {
        flag |= UserContextMenuFlag.BLOCK_REMOVE;
      } else {
        flag |= UserContextMenuFlag.BLOCK_ADD;
      }
      if (friendState === UserState.ONLINE) {
        flag |= UserContextMenuFlag.GAME_INVITE;
      }
      if (friendState === UserState.INGAME) {
        flag |= UserContextMenuFlag.GAME_SPECTATE;
      }
    }
    return flag;
  }, [
    mode,
    friends,
    friendState,
    userId,
    name,
    me?.name,
    me?.role,
    role,
    muted,
    blocks,
  ]);

  return (
    <flagContext.Provider value={menuFlag}>
      <TargetUserProvider userId={userId} userName={name}>
        <ContextMenu
          env={env ?? document}
          renderMenu={(isRendered: boolean) => (
            <MenuList>
              <UserContextMenuItem flag={UserContextMenuFlag.PROFILE}>
                <Link to={`user/${name}`}>
                  <MenuItem icon={<FaUserCircle />}>정보보기</MenuItem>
                </Link>
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.OTP_SETTING}>
                <Link to={`/otp/${name}`}>
                  <MenuItem icon={<FaUserEdit />}>OTP 설정</MenuItem>
                </Link>
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.FRIEND}>
                <MenuDivider />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.FRIEND_ADD}>
                <FriendMenu icon={FaUserPlus} label="친구추가" />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.BLOCK_ADD}>
                <BlockMenu
                  icon={FaUserSlash}
                  label="차단하기"
                  targetName={name}
                />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.BLOCK_REMOVE}>
                <BlockMenu
                  icon={FaUserSlash}
                  label="차단해제"
                  targetName={name}
                />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.GAME}>
                <MenuDivider />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.GAME_INVITE}>
                <InviteGameMenu isRendered={isRendered} />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.GAME_SPECTATE}>
                <SpectateMenu targetName={name} />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT}>
                <MenuDivider />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_KICK}>
                <KickMenu icon={GiBootKick} label="추방하기" />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_BAN}>
                <BanMenu icon={FaUserTimes} label="영구추방하기" />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_MUTE}>
                <MuteMenu icon={GiSpeakerOff} label="음소거시키기" />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_UNMUTE}>
                <MuteMenu icon={GiSpeaker} label="음소거해제" />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.ADMIN_APPROVE}>
                <AdminApproveMenu icon={TbCrown} label="관리자임명" cast />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.ADMIN_UNAPPROVE}>
                <AdminApproveMenu
                  icon={TbCrownOff}
                  label="관리자해제"
                  cast={false}
                />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.LOGOUT}>
                <LogoutMenu />
              </UserContextMenuItem>
            </MenuList>
          )}
        >
          {(ref: any) => (
            <ChildView style={{ cursor: 'pointer' }} ref={ref}>
              {children}
            </ChildView>
          )}
        </ContextMenu>
      </TargetUserProvider>
    </flagContext.Provider>
  );
}

UserContextMenu.defaultProps = {
  env: document,
  role: ChatMemberRole.MEMBER,
  muted: false,
  me: undefined,
};
