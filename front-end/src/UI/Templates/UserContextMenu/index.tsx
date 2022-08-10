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

export type UserContextMenuType = 'friend' | 'chat' | 'self';

const ChildView = styled.div`
  width: 100%;
`;

export default function UserContextMenu({
  target,
  targetName,
  mode,
  children,
  eventType,
}: {
  target: number;
  targetName: string;
  mode: UserContextMenuType;
  children: React.ReactNode;
  eventType?: 'click' | 'contextmenu';
}) {
  return (
    <TargetUserProvider userId={target} userName={targetName}>
      <ContextMenu
        eventType={eventType || 'contextmenu'}
        renderMenu={() => (
          <MenuList>
            <Link to="example/umjunsik">
              <MenuItem icon={<FaUserCircle />}>정보보기</MenuItem>
            </Link>
            {mode === 'self' && (
              <Link to="/otp/bylee">
                <MenuItem icon={<FaUserEdit />}>OTP 설정</MenuItem>
              </Link>
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
                <BanMenu icon={FaUserTimes} label="영구추방하기" />
                <MuteMenu icon={GiSpeakerOff} label="음소거시키기" cast />
                <MuteMenu icon={GiSpeaker} label="음소거해제" cast={false} />
                <AdminApproveMenu icon={TbCrown} label="관리자임명" cast />
                <AdminApproveMenu
                  icon={TbCrownOff}
                  label="관리자해제"
                  cast={false}
                />
              </>
            )}
            {mode === 'self' && (
              <>
                <MenuDivider />
                <LogoutMenu />
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
    </TargetUserProvider>
  );
}

UserContextMenu.defaultProps = {
  eventType: 'contextmenu',
};
