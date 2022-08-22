import React from 'react';
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function RoutedModal({
  children,
  closeOnOverlayClick,
  baseUrl,
  leaveModalHandler,
}: {
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  baseUrl?: string;
  leaveModalHandler?: () => void;
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
        if (leaveModalHandler !== undefined) {
          leaveModalHandler();
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
  leaveModalHandler: undefined,
};
