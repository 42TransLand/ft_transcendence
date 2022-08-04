import React from 'react';
import { ModalBody, ModalCloseButton } from '@chakra-ui/react';
import RoutedModal from '../../Templates/RoutedModal';
import ProfileContent from '../../Templates/ProfileContent';

function Profile() {
  return (
    <RoutedModal>
      <ModalCloseButton />
      <ModalBody>
        <ProfileContent isMyself />
      </ModalBody>
    </RoutedModal>
  );
}

export default Profile;
