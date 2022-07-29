import React from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import { Grid, GridItem, VStack, Input, Text, Button } from '@chakra-ui/react';

function CreateChannel() {
  return (
    <Grid
      h="100%"
      w="100%"
      templateRows="reapeat(4, 1fr)"
      templateColumns="repeat(6, 1fr)"
    >
      <GridItem rowSpan={1} colSpan={1}>
        <ChatIcon fontSize={40} />
      </GridItem>
      <GridItem rowSpan={3} colSpan={5}>
        <VStack align="baseline">
          <Text fontSize={10} color="gray">
            채널 이름
          </Text>
          <Input variant="flushed" />
          <Text fontSize={10} color="gray">
            최대 인원
          </Text>
          <Input variant="flushed" />
          <Text fontSize={10} color="gray">
            입장 비밀번호
          </Text>
          <Input type="password" variant="flushed" />
        </VStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={4} />
      <GridItem rowSpan={1} colSpan={2}>
        <Button colorScheme="gray" width="100%">
          채널 생성
        </Button>
      </GridItem>
    </Grid>
  );
}

export default CreateChannel;
