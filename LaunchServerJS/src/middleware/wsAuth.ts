import { Auth } from '../auth';

export const createWsAuthMiddleware = (auth: Auth) => async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }
  const token = authHeader.substring('Bearer '.length);
  const session = await auth.validate(token);
  return session;
};
