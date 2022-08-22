import React from 'react';
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function RoutedModal({
  children,
  closeOnOverlayClick,
  baseUrl,
  leaveChatRoomHandler,
}: {
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  baseUrl?: string;
  leaveChatRoomHandler?: () => void;
}) {
  const [isOpen, onClose] = React.useState(true);
  const navigate = useNavigate();

  return (
    <Modal
      closeOnOverlayClick={closeOnOverlayClick}
      blockScrollOnMount={false}
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose(false);
        if (leaveChatRoomHandler !== undefined) {
          leaveChatRoomHandler();
        }
      }}
      onCloseComplete={(): void => navigate(baseUrl ?? '/', { replace: true })}
      size={{ base: 'full', lg: '6xl' }}
    >
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}

RoutedModal.defaultProps = {
  closeOnOverlayClick: true,
  baseUrl: '/',
  leaveChatRoomHandler: undefined,
};
