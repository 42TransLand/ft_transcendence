import React, { useRef } from 'react';
import {
  MenuItem,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  HStack,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { MdSmartDisplay } from 'react-icons/md';

function SpectateMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const success = false;

  return (
    <>
      <MenuItem onClick={onOpen} icon={<MdSmartDisplay />}>
        <Text>관전하기</Text>
      </MenuItem>
      {success === false && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                <HStack>
                  <WarningIcon boxSize="1em" />
                  <Text>엥 이게 뭐지</Text>
                </HStack>
              </AlertDialogHeader>
              <AlertDialogBody>관전에 실패했습니다.</AlertDialogBody>
              <AlertDialogFooter>
                <Button colorScheme="green" ref={cancelRef} onClick={onClose}>
                  OK
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
}

export default SpectateMenu;
