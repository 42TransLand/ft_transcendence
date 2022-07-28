import { ChatIcon } from '@chakra-ui/icons';
import { HStack, VStack, Input, Text, Divider, Button } from '@chakra-ui/react';
import React from 'react';

function CreateChannel() {
  return (
    <HStack>
      <ChatIcon fontSize={40} />
      <VStack>
        <Text fontSize={10} color="gray">
          채널 이름
        </Text>
        <Input />
        <Divider />
        <Text fontSize={10} color="gray">
          최대 인원
        </Text>
        <Input />
        <Divider />
        <Text fontSize={10} color="gray">
          입장 비밀번호
        </Text>
        <Input type="password" />
        <Button colorScheme="gray" size="xs">
          채널 생성
        </Button>
      </VStack>
    </HStack>
  );
}

export default CreateChannel;
