import React from 'react';
import axios from 'axios';

export default function useAddFriend(id: number) {
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState({
    headerMessage: '',
    bodyMessage: '',
  });
  const clearError = React.useCallback(
    () => setError({ headerMessage: '', bodyMessage: '' }),
    [setError],
  );
  const cancelRef = React.useRef(null); // TODO: 삭제하기
  const onAddFriend = React.useCallback(() => {
    setSubmitting(true);
    axios
      .post('/friends/add', {
        id, // TODO: 실제 친구 추가 요청을 보내야 할 대상 유저ID로 수정
      })
      .then(() => {
        setSubmitting(false);
        // TODO: 친구 리스트 갱신 요청 (useQuery)
      })
      .catch((err) => {
        if (err.response) {
          setError({
            headerMessage: '친구 추가 실패',
            bodyMessage: err.response.data.message,
          });
        } else {
          setError({
            headerMessage: '친구 추가 실패',
            bodyMessage: err.message,
          });
        }
        setSubmitting(false);
      });
  }, [id]);
  return { isSubmitting, error, clearError, cancelRef, onAddFriend };
}
