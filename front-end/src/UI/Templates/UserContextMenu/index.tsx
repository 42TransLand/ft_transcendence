import React from 'react';
import { MenuList, MenuItem } from '@chakra-ui/react';
import styled from 'styled-components';
import { ContextMenu } from '../../Atoms/ContextMenu';

export type UserContextMenuType = 'friend' | 'chat';

const ChildView = styled.div`
  width: 100%;
`;

export default function UserContextMenu({
  mode,
  children,
}: {
  mode: UserContextMenuType;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu
      renderMenu={() => (
        <MenuList>
          <MenuItem>정보보기</MenuItem>
          <MenuItem>게임초대</MenuItem>
          <MenuItem>관전하기</MenuItem>
          <MenuItem>친구추가</MenuItem>
          <MenuItem>친구삭제</MenuItem>
          <MenuItem>차단하기</MenuItem>
          <MenuItem>차단해제</MenuItem>
          {mode === 'chat' && <MenuItem>영구추방하기</MenuItem>}
          {mode === 'chat' && <MenuItem>음소거시키기</MenuItem>}
          {mode === 'chat' && <MenuItem>음소거해제</MenuItem>}
          {mode === 'chat' && <MenuItem>관리자임명</MenuItem>}
          {mode === 'chat' && <MenuItem>관리자해제</MenuItem>}
        </MenuList>
      )}
    >
      {(ref: any) => <ChildView ref={ref}>{children}</ChildView>}
    </ContextMenu>
  );
}
