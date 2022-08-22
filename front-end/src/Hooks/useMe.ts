import { useQuery } from '@tanstack/react-query';
import USERS_ME_GET from '../Queries/Users/Me';

export default function useMe() {
  const { data, error, isLoading } = useQuery(USERS_ME_GET);
  if (isLoading) {
    return {
      id: '0',
      nickname: '불러오는중',
      profileImg: 'https://cdn.intra.42.fr/users/3b3.jpg',
      rankScore: 0,
      tfaEnabled: false,
      isFirstLogin: false,
    };
  }
  if (error) {
    return {
      id: '0',
      nickname: '알수없음',
      profileImg: 'https://cdn.intra.42.fr/users/3b3.jpg',
      rankScore: 0,
      tfaEnabled: false,
      isFirstLogin: false,
    };
  }
  return data;
}
