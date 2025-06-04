import { Auth } from '../auth';

export const createAuthMiddleware = (auth: Auth) => async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = authHeader.substring('Bearer '.length);
  const session = await auth.validate(token);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  return session;
};
