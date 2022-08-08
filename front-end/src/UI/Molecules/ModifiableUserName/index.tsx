import React, { useState, useMemo } from 'react';
import {
  Text,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import { IoMdSave } from 'react-icons/io';

function ModifiableUserName(props: { userName: string; isMyself: boolean }) {
  const { userName, isMyself } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [modUserName, setModUserName] = useState(userName);
  const isError = useMemo(() => modUserName.length === 0, [modUserName]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModUserName(e.target.value);
  };

  if (!isMyself) {
    return <Text fontSize="3xl">{userName}</Text>;
  }
  return isEditing ? (
    <FormControl isInvalid={isError}>
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (!isError) setIsEditing(false);
        }}
      >
        <InputGroup>
          <Input
            variant="flushed"
            size="lg"
            onChange={handleOnChange}
            value={modUserName}
            isInvalid={isError}
          />
          <InputRightElement>
            <Input as={Button} type="submit" isInvalid={false}>
              <Icon as={IoMdSave} boxSize="1.5rem" />
            </Input>
          </InputRightElement>
        </InputGroup>
        {isError && <FormErrorMessage>빈 칸 안 돼</FormErrorMessage>}
      </form>
    </FormControl>
  ) : (
    <Text
      onClick={() => {
        setIsEditing(true);
      }}
      cursor="pointer"
      fontSize="3xl"
    >
      {modUserName}
    </Text>
  );
}

export default ModifiableUserName;
