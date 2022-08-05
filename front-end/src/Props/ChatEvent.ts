export default interface ChatEvent {
  type:
    | 'banned'
    | 'muted'
    | 'unmuted'
    | 'adminApproved'
    | 'adminUnapproved'
    | 'ownerSucceeded';
  target: string;

  // true: 내가 내린 명령이며, 성공했을 경우.
  // false: 내가 내린 명령이며, 실패했을 경우.
  // undefined: 내가 내린 명령이 아닐 경우.
  commandSuccessful?: boolean | undefined;
}
