import axios from 'axios';
import UserSearchResultProps from '../../Props/UserSearchResultProps';

// 테스트 코드
const friends = [
  {
    id: 1,
    nickname: '정우성',
    profileIcon: 'https://avatars0.githubusercontent.com/u/139426?s=460&v=4',
  },
  {
    id: 2,
    nickname: '하정우',
    profileIcon:
      'http://res.heraldm.com/content/image/2015/12/29/20151229000683_0.jpg',
  },
  {
    id: 3,
    nickname: '공유',
    profileIcon:
      'https://img.insight.co.kr/static/2021/09/25/700/img_20210925165035_b1091l47.webp',
  },
  {
    id: 4,
    nickname: '지수',
    profileIcon:
      'https://img.sbs.co.kr/newsnet/etv/upload/2021/07/08/30000699784.jpg',
  },
  {
    id: 5,
    nickname: '박신혜',
    profileIcon:
      'https://nimage.g-enews.com/phpwas/restmb_allidxmake.php?idx=5&simg=2022011217433704634e250e8e18812113127174.jpg',
  },
  {
    id: 6,
    nickname: '서현진',
    profileIcon:
      'http://t1.daumcdn.net/movie/759dde5f25480f3acc2d4b21375519ad1dc11ebf',
  },
];

const USERS_SEARCH_GET = (nickname: string) => ({
  queryKey: ['search', nickname],
  queryFn: async (): Promise<UserSearchResultProps[]> => {
    if (!nickname) return [];

    // 테스트 코드
    return friends.filter((user) => user.nickname.includes(nickname));

    // 실제 코드
    return axios.get('/users/search', { params: { nickname } });
  },
});

export default USERS_SEARCH_GET;
