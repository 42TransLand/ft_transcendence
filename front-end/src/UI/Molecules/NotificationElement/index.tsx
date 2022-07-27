import React from 'react';
import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';
import AcceptanceButton from '../../Atoms/AcceptanceButton';

function NotificationElement(props: { userName: string }) {
  const { userName } = props;

  return (
    <Grid
      h="80px"
      w="200px"
      templateRows="repeat(4, 1fr)"
      templateColumns="repeat(10, 1fr)"
      gap={1}
      bgColor="grey"
      borderWidth="1px"
      borderColor="black"
    >
      <GridItem rowSpan={4} colSpan={3} bg="tomato" margin="auto">
        <Avatar name={userName} />
      </GridItem>
      <GridItem rowSpan={3} colSpan={7} bg="brown" textAlign="center">
        <Text fontSize="xs">
          {userName}님께서
          <br />
        </Text>
        <Text fontSize="xs">친구신청을 보냈습니다.</Text>
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={2}
        bg="pink"
        margin="auto"
        textAlign="center"
      >
        <Text fontSize="xs">방금전</Text>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} />
      <GridItem rowSpan={1} colSpan={4} bg="yellow">
        <AcceptanceButton />
      </GridItem>
    </Grid>
  );
}

export default NotificationElement;
