import React, { useState } from 'react';
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  IconButton,
  HStack,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

function GameInvitationModal() {
  const [isOpen, onClose] = useState(true);
  const userName: string = 'Kodak Black';
  const gameMode: string = '이지 모드';
  const isRanked: boolean = true;

  return (
    <Modal
      isOpen={isOpen}
      onClose={(): void => onClose(false)}
      size="lg"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <h1>게임 초대</h1>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack spacing={4}>
            <Avatar name={userName} size="md" />
            <HStack spacing={4}>
              <Text fontSize="lg" lineHeight={1.25}>
                {userName}님께서 당신을
                <br />
                {gameMode} {isRanked ? '랭크' : '일반'} 게임에 초대하였습니다.
              </Text>
              <Text fontSize="sm" paddingY={1.5}>
                방금전
              </Text>
            </HStack>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={1}>
            <IconButton
              colorScheme="green"
              aria-label="accept"
              icon={<CheckIcon />}
              size="sm"
              onClick={(): void => onClose(false)}
            />
            <IconButton
              colorScheme="red"
              aria-label="decline"
              icon={<CloseIcon />}
              size="sm"
              onClick={(): void => onClose(false)}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GameInvitationModal;
