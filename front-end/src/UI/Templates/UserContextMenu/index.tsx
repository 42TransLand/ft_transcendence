import React from 'react';
import { MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import {
  FaUserCircle,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { GoSignOut } from 'react-icons/go';
import { MdSmartDisplay } from 'react-icons/md';
import { TbCrown, TbCrownOff } from 'react-icons/tb';
import styled from 'styled-components';
import { ContextMenu } from '../../Atoms/ContextMenu';

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
          <MenuItem icon={<FaUserCircle />}>정보보기</MenuItem>
          {mode === 'self' && (
            <MenuItem icon={<FaUserEdit />}>프로필수정</MenuItem>
          )}
          {mode !== 'self' && (
            <>
              <MenuDivider />
              <MenuItem icon={<FaUserPlus />}>친구추가</MenuItem>
              <MenuItem icon={<FaUserMinus />}>친구삭제</MenuItem>
              <MenuItem icon={<FaUserSlash />}>차단하기</MenuItem>
              <MenuItem icon={<FaUserSlash />}>차단해제</MenuItem>
            </>
          )}
          {mode !== 'self' && (
            <>
              <MenuDivider />
              <MenuItem icon={<IoGameController />}>게임초대</MenuItem>
              <MenuItem icon={<MdSmartDisplay />}>관전하기</MenuItem>
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
          style={{ cursor: eventType === 'click' ? 'pointer' : 'auto' }}
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
