import React, { useState } from 'react';
import {
  Grid,
  GridItem,
  VStack,
  Text,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Icon, ChevronDownIcon } from '@chakra-ui/icons';
import { GrGamepad } from 'react-icons/gr';

function InviteGame() {
  const [gameMode, setGameMode] = useState('기본모드');
  const onCliclkBasic = () => {
    setGameMode('기본모드');
  };
  const onClickHard = () => {
    setGameMode('하드모드');
  };

  return (
    <Grid
      h="100%"
      w="100%"
      templateRows="reapeat(3, 1fr)"
      templateColumns="repeat(6, 1fr)"
    >
      <GridItem rowSpan={1} colSpan={1}>
        <Icon as={GrGamepad} fontSize={40} />
      </GridItem>
      <GridItem rowSpan={2} colSpan={5}>
        <VStack align="baseline">
          <Text fontSize={10} color="gray">
            게임 모드
          </Text>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {gameMode}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onCliclkBasic}>기본모드</MenuItem>
              <MenuItem onClick={onClickHard}>하드모드</MenuItem>
            </MenuList>
          </Menu>
          <Text fontSize={10} color="gray">
            초대할 상대방
          </Text>
          <Input variant="flushed" />
        </VStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={4} />
      <GridItem rowSpan={1} colSpan={2}>
        <Button colorScheme="gray" width="100%">
          게임 초대
        </Button>
      </GridItem>
    </Grid>
  );
}

export default InviteGame;
