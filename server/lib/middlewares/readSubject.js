import jwtDecode from 'jwt-decode';

module.exports = function readSubject(req, res, next) {
  try {
    const authorizationHeader = req.get('Authorization') || '';
    const token = authorizationHeader
      .replace('Bearer ', '');
    const decodedToken = jwtDecode(token);
    req.sub = decodedToken.sub;
    console.log('subject:', req.sub);
    next();
  } catch (e) {
    next(e);
  }
};
