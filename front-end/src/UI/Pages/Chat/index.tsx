import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatProvider, useChat } from '../../../Hooks/useChat';
import ChatModal from '../../Templates/ChatModal';

function ChatExampleChannel() {
  const { id } = useParams();
  const [, dispatch] = useChat();

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`채팅방-${id}에 입장합니다.`);
    dispatch({
      action: 'updateInfo',
      chatInfo: {
        roomType: id === '1' ? 'protected' : 'public',
        channelId: 0,
        channelName: '이것이 바로 채팅방이다..!!',
        maxHeadCount: 50,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: '엄준식은살아있다',
        profileIcon: '/profileicons/umjunsik.jpeg',
        role: 'member',
        muted: false,
        blocked: false,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: 'YuriMyWife',
        profileIcon: '/profileicons/yuri.jpeg',
        role: 'member',
        muted: false,
        blocked: false,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: '박수고양이',
        profileIcon: '/profileicons/catclap.gif',
        role: 'member',
        muted: false,
        blocked: false,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: '새침소녀',
        profileIcon: '/profileicons/deregirl.jpeg',
        role: 'member',
        muted: false,
        blocked: true,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: '아그래요',
        profileIcon: '/profileicons/orly.jpeg',
        role: 'member',
        muted: true,
        blocked: false,
      },
    });
    for (let i = 0; i < 10; i += 1) {
      dispatch({
        action: 'insertMember',
        chatMember: {
          name: `아그래요${i}`,
          profileIcon: '/profileicons/orly.jpeg',
          role: 'member',
          muted: true,
          blocked: false,
        },
      });
    }
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message: "Mom's spaghetti",
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '뭐래',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message: '니네 어머님 만수무강 백년해로',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '응 너네 아버님 옥체보존 무병장수',
    });
    dispatch({
      action: 'chat',

      name: 'YuriMyWife',
      message: '어쩔티비 저쩔냉장고 어쩔아이패드 저쩔 맥북프로',
    });
    dispatch({
      action: 'chat',
      name: '박수고양이',
      message: '이놈들 또 난리났다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
    });
    dispatch({
      action: 'chat',
      name: '새침소녀',
      message: '니네 뭐하냐?',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '진짜',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '저 녀석은 정신이 나간게 맞는거 같아.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    return () => {
      // eslint-disable-next-line no-console
      console.log(`채팅방-${id}에서 퇴장합니다.`);
    };
  }, [dispatch, id]);

  return <div />;
}

function ChatExampleDM() {
  const { userName } = useParams();
  const [, dispatch] = useChat();

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`DM-${userName}에 입장합니다.`);
    dispatch({
      action: 'updateInfo',
      chatInfo: {
        roomType: 'private',
        channelId: 0,
        channelName: 'YuriMyWife',
        maxHeadCount: 2,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: '엄준식은살아있다',
        profileIcon: '/profileicons/umjunsik.jpeg',
        role: 'owner',
        muted: false,
        blocked: false,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        name: 'YuriMyWife',
        profileIcon: '/profileicons/yuri.jpeg',
        role: 'admin',
        muted: false,
        blocked: false,
      },
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message: '왜',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '야 너',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '솔직히 자제좀 하자;;',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '진짜 뭐 머리 다치기라도 했어?',
    });
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message:
        '대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 법관은 헌법과 법률에 의하여 그 양심에 따라 독립하여 심판한다. 감사원의 조직·직무범위·감사위원의 자격·감사대상공무원의 범위 기타 필요한 사항은 법률로 정한다. 제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며, 그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에 대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2 이상의 찬성이 있어야 한다.',
    });
    dispatch({
      action: 'chat',
      name: 'YuriMyWife',
      message: '대단하다. 👍',
    });
    return () => {
      // eslint-disable-next-line no-console
      console.log(`채팅방-${userName}에서 퇴장합니다.`);
    };
  }, [dispatch, userName]);

  return <div />;
}

export default function Chat({ dm }: { dm: boolean }) {
  return (
    <ChatProvider>
      {dm ? <ChatExampleDM /> : <ChatExampleChannel />}
      <ChatModal />
    </ChatProvider>
  );
}
