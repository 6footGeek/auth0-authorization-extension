import { Router } from 'express';
import auth0 from '../lib/auth0';
export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    const options = {
      sort: 'last_login:-1',
      search_engine: 'v2',
      q: req.query.search,
      per_page: req.query.per_page || 100,
      page: req.query.page || 0,
      include_totals: true,
      fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked'
    };

    auth0.getUsers(options)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.get('/:id', (req, res, next) => {
    auth0.getUser(req.params.id)
      .then(user => res.json({ user }))
      .catch(next);
  });

  api.get('/:id/devices', (req, res, next) => {
    auth0.getDevices(req.params.id)
      .then(devices => res.json({ devices }))
      .catch(next);
  });

  api.get('/:id/logs', (req, res, next) => {
    auth0.getUserLogs(req.params.id)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.delete('/:id/multifactor/:provider', (req, res, next) => {
    auth0.deleteUserMultiFactor(req.params.id, req.params.provider)
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  api.post('/:id/block', (req, res, next) => {
    auth0.patchUser(req.params.id, { blocked: true })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  api.post('/:id/unblock', (req, res, next) => {
    auth0.patchUser(req.params.id, { blocked: false })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  return api;
};
