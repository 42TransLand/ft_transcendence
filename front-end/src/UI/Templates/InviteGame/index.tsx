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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useInviteGame from '../../../Hooks/useInviteGame';
import GameMode from '../../../Games/dto/constants/game.mode.enum';

const InviteGameScheme = Yup.object().shape({
  mode: Yup.mixed<GameMode>().required('올바른 게임모드를 선택해주세요.'),
  scoreForWin: Yup.number()
    .required('승리 목표 점수를 입력해주세요.')
    .min(1, '승리 목표 점수는 1 이상이어야 합니다.')
    .max(100, '승리 목표 점수는 100 이하이어야 합니다.'),
});

function InviteGame({ nickname }: { nickname: string }) {
  const { onSubmit, WarningDialogComponent } = useInviteGame(nickname);

  return (
    <Formik
      initialValues={{ mode: GameMode.CLASSIC, scoreForWin: 5 }}
      validationSchema={InviteGameScheme}
      onSubmit={onSubmit}
    >
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
                    <option value={GameMode.CLASSIC}>기본모드</option>
                    <option value={GameMode.SPEED}>스피드모드</option>
                  </Field>
                  <Text fontSize={10} color="gray">
                    승리 목표 점수
                  </Text>
                  <Field as={Input} name="scoreForWin" />
                  <Text fontSize="xs" textColor="red.500">
                    <ErrorMessage name="scoreForWin" />
                  </Text>
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
