import React from 'react';
import { Link } from 'react-router-dom';
import { MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import {
  FaUserCircle,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { GoSignOut } from 'react-icons/go';
import { TbCrown, TbCrownOff } from 'react-icons/tb';
import styled from 'styled-components';
import { ContextMenu } from '../../Atoms/ContextMenu';
import InviteGameMenu from '../../Molecules/InviteGameMenu';
import SpectateMenu from '../../Molecules/SpectateMenu';
import FriendMenu from '../../Molecules/FriendMenu';
import BlockMenu from '../../Molecules/BlockMenu';

export type UserContextMenuType = 'friend' | 'chat' | 'self';

const ChildView = styled.div`
  width: 100%;
`;

export default function UserContextMenu({
  mode,
  children,
  eventType,
}: {
  mode: UserContextMenuType;
  children: React.ReactNode;
  eventType?: 'click' | 'contextmenu';
}) {
  return (
    <ContextMenu
      eventType={eventType || 'contextmenu'}
      renderMenu={() => (
        <MenuList>
          <Link to="example/umjunsik">
            <MenuItem icon={<FaUserCircle />}>정보보기</MenuItem>
          </Link>
          {mode === 'self' && (
            <MenuItem icon={<FaUserEdit />}>프로필수정</MenuItem>
          )}
          {mode !== 'self' && (
            <>
              <MenuDivider />
              <FriendMenu icon={FaUserPlus} label="친구추가" />
              <FriendMenu icon={FaUserMinus} label="친구삭제" />
              <BlockMenu icon={FaUserSlash} label="차단하기" />
              <BlockMenu icon={FaUserSlash} label="차단해제" />
            </>
          )}
          {mode !== 'self' && (
            <>
              <MenuDivider />
              <InviteGameMenu />
              <SpectateMenu />
            </>
          )}
          {mode === 'chat' && (
            <>
              <MenuDivider />
              <MenuItem icon={<FaUserTimes />}>영구추방하기</MenuItem>
              <MenuItem icon={<GiSpeakerOff />}>음소거시키기</MenuItem>
              <MenuItem icon={<GiSpeaker />}>음소거해제</MenuItem>
              <MenuItem icon={<TbCrown />}>관리자임명</MenuItem>
              <MenuItem icon={<TbCrownOff />}>관리자해제</MenuItem>
            </>
          )}
          {mode === 'self' && (
            <>
              <MenuDivider />
              <MenuItem icon={<GoSignOut />}>로그아웃</MenuItem>
            </>
          )}
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
  );
}

UserContextMenu.defaultProps = {
  eventType: 'contextmenu',
};
