import jwt from 'jsonwebtoken';
import {promisify} from 'util';

import authConfig from '../../config/auth';


export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({error: 'Token not provided'});
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    if (!(decoded.is_admin)) {
      return res.status(401).json({error: 'User not is administrator'});
    }
    return next();
  } catch (err) {
    return res.status(401).json({error: 'Token invalid'});
  }
};
