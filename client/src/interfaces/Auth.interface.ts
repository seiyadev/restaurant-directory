export interface Props {
  isAuth: boolean;
}

export interface PropsUser {
  user: { id: string; username: string; email: string } | null;
}