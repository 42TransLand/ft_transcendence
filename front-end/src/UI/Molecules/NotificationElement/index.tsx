import React from 'react';
import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';
import AcceptanceButton from '../AcceptanceButton';
import NotificationProps from '../../../Props/NotificationProps';
import useTime from '../../../Hooks/useTime';

function NotificationElement({
  alertId,
  requestor,
  createdAt,
}: NotificationProps) {
  const time = useTime(createdAt);

  return (
    <Grid
      h="100px"
      w="100%"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(10, 1fr)"
      borderWidth="1px"
      borderRadius="md"
      paddingX={3}
      paddingY={2}
    >
      <GridItem rowSpan={3} colSpan={1} margin="auto">
        <Avatar
          name={requestor.nickname}
          src={`${process.env.REACT_APP_API_HOST}/${requestor.profileImg}`}
          size="md"
        />
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} />
      <GridItem rowSpan={2} colSpan={8}>
        <Text fontSize="lg" lineHeight={1.25}>
          {requestor.nickname}님께서
          <br />
          친구신청을 보냈습니다
        </Text>
      </GridItem>
      <GridItem rowSpan={2} colSpan={1} />
      <GridItem rowSpan={1} colSpan={4} flex="">
        <Text fontSize="sm" paddingY={1.5}>
          {time}
        </Text>
      </GridItem>
      <GridItem rowSpan={1} colSpan={2} />
      <GridItem rowSpan={1} colSpan={2}>
        <AcceptanceButton alertId={alertId} senderId={requestor.id} />
      </GridItem>
    </Grid>
  );
}

export default NotificationElement;
