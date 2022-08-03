import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import RoutedModal from '../../Templates/RoutedModal';

export default function RoutedModalExample() {
  const { name } = useParams();

  return (
    <RoutedModal>
      <ModalHeader>
        <Text fontSize="2xl">안녕 {name}아</Text>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody pb={6}>
        <Text>
          국가는 청원에 대하여 심사할 의무를 진다. 모든 국민은 법률이 정하는
          바에 의하여 납세의 의무를 진다. 모든 국민은 법률이 정하는 바에 의하여
          선거권을 가진다.
        </Text>
        <Text>
          누구든지 체포 또는 구속을 당한 때에는 적부의 심사를 법원에 청구할
          권리를 가진다. 국무총리는 국회의 동의를 얻어 대통령이 임명한다.
          대한민국의 영토는 한반도와 그 부속도서로 한다.
        </Text>
        <Text>
          이 헌법시행 당시의 법령과 조약은 이 헌법에 위배되지 아니하는 한 그
          효력을 지속한다. 비상계엄이 선포된 때에는 법률이 정하는 바에 의하여
          영장제도, 언론·출판·집회·결사의 자유, 정부나 법원의 권한에 관하여
          특별한 조치를 할 수 있다.
        </Text>
        <Text>
          대통령은 법률이 정하는 바에 의하여 사면·감형 또는 복권을 명할 수 있다.
          대통령의 임기연장 또는 중임변경을 위한 헌법개정은 그 헌법개정 제안
          당시의 대통령에 대하여는 효력이 없다.
        </Text>
      </ModalBody>
    </RoutedModal>
  );
}
