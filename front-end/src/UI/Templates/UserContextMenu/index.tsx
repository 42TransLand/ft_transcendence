/* eslint-disable no-bitwise */
import React from 'react';
import { Link } from 'react-router-dom';
import { MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import {
  FaUserCircle,
  FaUserEdit,
  FaUserPlus,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
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

export type UserContextMenuType = 'friend' | 'chat' | 'self';

enum UserContextMenuFlag {
  PROFILE = 1 << 0,
  OTP_SETTING = 1 << 1,
  FRIEND_ADD = 1 << 2,
  BLOCK_ADD = 1 << 3,
  BLOCK_REMOVE = 1 << 4,
  GAME_INVITE = 1 << 5,
  GAME_SPECTATE = 1 << 6,
  CHAT_BAN = 1 << 7,
  CHAT_MUTE = 1 << 8,
  CHAT_UNMUTE = 1 << 9,
  ADMIN_APPROVE = 1 << 10,
  ADMIN_UNAPPROVE = 1 << 11,
  LOGOUT = 1 << 12,

  FRIEND = FRIEND_ADD | BLOCK_ADD | BLOCK_REMOVE,
  GAME = GAME_INVITE | GAME_SPECTATE,
  CHAT = CHAT_BAN | CHAT_MUTE | CHAT_UNMUTE | ADMIN_APPROVE | ADMIN_UNAPPROVE,
  ALL = PROFILE | OTP_SETTING | FRIEND | GAME | CHAT | LOGOUT,
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
  target,
  targetName,
  mode,
  children,
  eventType,
}: {
  target: string;
  targetName: string;
  mode: UserContextMenuType;
  children: React.ReactNode;
  eventType?: 'click' | 'contextmenu';
}) {
  const { state } = useSocket();
  const friends = useFriends();
  const friendState = state.friendState[target];
  const menuFlag = React.useMemo(() => {
    let flag = UserContextMenuFlag.PROFILE;
    if (mode === 'self') {
      flag |= UserContextMenuFlag.OTP_SETTING;
      flag |= UserContextMenuFlag.LOGOUT;
    } else {
      if (friends.filter((f) => f.id === target).length === 0) {
        flag |= UserContextMenuFlag.FRIEND_ADD;
      }
      if (friends.filter((f) => f.id === target && f.isBlocked).length === 0) {
        flag |= UserContextMenuFlag.BLOCK_ADD;
      } else {
        flag |= UserContextMenuFlag.BLOCK_REMOVE;
      }
      if (friendState === UserState.ONLINE) {
        flag |= UserContextMenuFlag.GAME_INVITE;
      }
      if (friendState === UserState.INGAME) {
        flag |= UserContextMenuFlag.GAME_SPECTATE;
      }
    }
    if (mode === 'chat') {
      flag |= UserContextMenuFlag.CHAT;
    }
    flag |= UserContextMenuFlag.GAME;
    return flag;
  }, [mode, friends, target, friendState]);

  return (
    <flagContext.Provider value={menuFlag}>
      <TargetUserProvider userId={target} userName={targetName}>
        <ContextMenu
          eventType={eventType || 'contextmenu'}
          renderMenu={() => (
            <MenuList>
              <UserContextMenuItem flag={UserContextMenuFlag.PROFILE}>
                <Link to={`/user/${targetName}`}>
                  <MenuItem icon={<FaUserCircle />}>정보보기</MenuItem>
                </Link>
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.OTP_SETTING}>
                <Link to={`/otp/${targetName}`}>
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
                  targetName={targetName}
                />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.BLOCK_REMOVE}>
                <BlockMenu
                  icon={FaUserSlash}
                  label="차단해제"
                  targetName={targetName}
                />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.GAME}>
                <MenuDivider />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.GAME_INVITE}>
                <InviteGameMenu />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.GAME_SPECTATE}>
                <SpectateMenu />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT}>
                <MenuDivider />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_BAN}>
                <BanMenu icon={FaUserTimes} label="영구추방하기" />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_MUTE}>
                <MuteMenu icon={GiSpeakerOff} label="음소거시키기" cast />
              </UserContextMenuItem>
              <UserContextMenuItem flag={UserContextMenuFlag.CHAT_UNMUTE}>
                <MuteMenu icon={GiSpeaker} label="음소거해제" cast={false} />
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
            <ChildView
              style={{ cursor: eventType === 'click' ? 'pointer' : 'default' }}
              ref={ref}
            >
              {children}
            </ChildView>
          )}
        </ContextMenu>
      </TargetUserProvider>
    </flagContext.Provider>
  );
}

UserContextMenu.defaultProps = {
  eventType: 'contextmenu',
};
