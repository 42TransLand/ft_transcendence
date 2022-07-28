import React from 'react';
import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';
import AcceptanceButton from '../../Atoms/AcceptanceButton';

function NotificationElement(props: { userName: string }) {
  const { userName } = props;

  return (
    <Grid
      h="90px"
      w="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(10, 1fr)"
      bgColor="blue.200"
      borderWidth="1px"
      borderColor="black"
    >
      <GridItem rowSpan={3} colSpan={1} margin="auto">
        <Avatar name={userName} size="md" />
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} />
      <GridItem rowSpan={1} colSpan={8}>
        <Text fontSize="lg">{userName}님께서</Text>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} />
      <GridItem rowSpan={1} colSpan={8}>
        <Text fontSize="lg">친구신청을 보냈습니다</Text>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} />
      <GridItem rowSpan={1} colSpan={2}>
        <Text fontSize="md">방금전</Text>
      </GridItem>
      <GridItem rowSpan={1} colSpan={6}>
        <AcceptanceButton />
      </GridItem>
    </Grid>
  );
}

export default NotificationElement;
