import React from 'react';
import {
  Grid,
  GridItem,
  VStack,
  Text,
  Button,
  Input,
  Select,
} from '@chakra-ui/react';
import { Icon, ChevronDownIcon } from '@chakra-ui/icons';
import { GrGamepad } from 'react-icons/gr';
import { Formik, Form, Field } from 'formik';
import useInviteGame from '../../../Hooks/useInviteGame';

function InviteGame({ id, nickname }: { id: number; nickname: string }) {
  const { onSubmit, WarningDialogComponent } = useInviteGame(id);

  return (
    <Formik initialValues={{ mode: 'classic' }} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <>
          <Form>
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
                  <Field as={Select} name="mode" icon={<ChevronDownIcon />}>
                    <option value="classic">기본모드</option>
                    <option value="hardcore">하드모드</option>
                  </Field>
                  <Text fontSize={10} color="gray">
                    초대할 상대방
                  </Text>
                  <Input
                    variant="flushed"
                    value={nickname}
                    textColor="gray.500"
                    isDisabled
                  />
                </VStack>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4} />
              <GridItem rowSpan={1} colSpan={2}>
                <Button
                  type="submit"
                  colorScheme="gray"
                  width="100%"
                  isLoading={isSubmitting}
                >
                  게임 초대
                </Button>
              </GridItem>
            </Grid>
          </Form>
          {WarningDialogComponent}
        </>
      )}
    </Formik>
  );
}

export default InviteGame;
