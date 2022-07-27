import React, { useState } from 'react';
import { Box, Center, Text, IconButton, HStack } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

function AcceptDeclineButtons(props: {
  handleClick: (AcceptanceVal: boolean) => void;
}) {
  const { handleClick } = props;

  return (
    <div>
      <HStack spacing={1}>
        <IconButton
          colorScheme="green"
          aria-label="accept"
          icon={<CheckIcon />}
          size="sm"
          onClick={() => handleClick(true)}
        />
        <IconButton
          colorScheme="red"
          aria-label="decline"
          icon={<CloseIcon />}
          size="sm"
          onClick={() => handleClick(false)}
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

function AcceptanceButton() {
  const [AcceptanceState, setAcceptanceState] = useState({
    isChecked: false,
    isAccepted: false,
  });

  const handleClick = (AcceptanceVal: boolean) => {
    setAcceptanceState({ isChecked: true, isAccepted: AcceptanceVal });
  };

  return (
    <Box w="65px" h="32px">
      {AcceptanceState.isChecked ? (
        <AcceptanceResult isAccepted={AcceptanceState.isAccepted} />
      ) : (
        <AcceptDeclineButtons handleClick={handleClick} />
      )}
    </Box>
  );
}

export default AcceptanceButton;
