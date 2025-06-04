function oauthMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice('Bearer '.length);
  if (token !== process.env.OAUTH_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
}

module.exports = oauthMiddleware;
