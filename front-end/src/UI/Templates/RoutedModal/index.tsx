import React from 'react';
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function RoutedModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, onClose] = React.useState(true);
  const navigate = useNavigate();

  return (
    <Modal
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      onClose={() => onClose(false)}
      onCloseComplete={(): void => navigate('/', { replace: true })}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
