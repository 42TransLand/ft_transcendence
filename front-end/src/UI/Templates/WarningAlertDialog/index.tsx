import { WarningIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

function WarningAlertDialog({
  isOpen,
  onClose,
  cancelRef,
  headerMessage,
  bodyMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.MutableRefObject<null>;
  headerMessage: string;
  bodyMessage: string;
}) {
  return (
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
              <Text>{headerMessage}</Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>{bodyMessage}</AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="green" ref={cancelRef} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default WarningAlertDialog;
