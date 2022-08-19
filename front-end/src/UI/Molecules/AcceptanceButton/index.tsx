import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { Box, Center, Text, IconButton, HStack } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import FRIEND_ACCEPT_PATCH from '../../../Queries/Friends/Accept';
import FRIEND_REJECT_DELETE from '../../../Queries/Friends/Reject';

function AcceptDeclineButtons(props: {
  handleClick: (AcceptanceVal: boolean) => void;
  isLoading: boolean;
}) {
  const { handleClick, isLoading } = props;

  return (
    <div>
      <HStack spacing={1}>
        <IconButton
          colorScheme="green"
          aria-label="accept"
          icon={<CheckIcon />}
          size="sm"
          onClick={() => handleClick(true)}
          isLoading={isLoading}
        />
        <IconButton
          colorScheme="red"
          aria-label="decline"
          icon={<CloseIcon />}
          size="sm"
          onClick={() => handleClick(false)}
          isLoading={isLoading}
        />
      </HStack>
    </div>
  );
}

function AcceptanceResult(props: { isAccepted: boolean }) {
  const { isAccepted } = props;
  const color = isAccepted ? 'blue.400' : 'red.400';

  return (
    <Center
      w="100%"
      h="100%"
      border="1px"
      bgColor="white"
      borderColor={color}
      alignItems="center"
    >
      <Text color={color}>{isAccepted ? '수락됨' : '거절됨'}</Text>
    </Center>
  );
}

function AcceptanceButton({
  alertId,
  senderId,
}: {
  alertId: string;
  senderId: string;
}) {
  const [acceptanceState, setAcceptanceState] = useState({
    isChecked: false,
    isAccepted: false,
  });
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const { setError, WarningDialogComponent } = useWarningDialog();
  const onError = React.useCallback(
    (err: AxiosError<any, any>, mode: string) => {
      setError({
        headerMessage: `${mode} 실패`,
        bodyMessage: err.response?.data.message ?? err.message,
      });
      setAcceptanceState({ ...acceptanceState, isChecked: false });
      setLoading(false);
    },
    [setError, setLoading, acceptanceState],
  );
  const onSuccess = React.useCallback(
    (acceptance: boolean) => {
      setAcceptanceState({ isChecked: true, isAccepted: acceptance });
      setLoading(false);
      queryClient.invalidateQueries(['friend']);
    },
    [setAcceptanceState, setLoading, queryClient],
  );
  const mutationAccept = useMutation(
    FRIEND_ACCEPT_PATCH(alertId, senderId, {
      onSuccess: () => onSuccess(true),
      onError: (err) => onError(err, '수락'),
    }),
  );
  const mutationReject = useMutation(
    FRIEND_REJECT_DELETE(alertId, senderId, {
      onSuccess: () => onSuccess(false),
      onError: (err) => onError(err, '거절'),
    }),
  );
  const handleClick = React.useCallback(
    (acceptanceVal: boolean) => {
      setLoading(true);
      if (acceptanceVal) mutationAccept.mutate();
      else mutationReject.mutate();
    },
    [mutationAccept, mutationReject, setLoading],
  );

  return (
    <Box w="65px" h="32px">
      {acceptanceState.isChecked ? (
        <AcceptanceResult isAccepted={acceptanceState.isAccepted} />
      ) : (
        <AcceptDeclineButtons isLoading={isLoading} handleClick={handleClick} />
      )}
      {WarningDialogComponent}
    </Box>
  );
}

export default AcceptanceButton;
