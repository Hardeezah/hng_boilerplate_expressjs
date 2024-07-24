// src/test/user.spec.ts

import request from 'supertest';
import server from '../index';
import AppDataSource from '../data-source';
import { User } from '../models';
import { hashPassword } from '../utils';

describe('User Update Password Endpoint', () => {
  let token: string;
  let user: User;

  beforeAll(async () => {
    await AppDataSource.initialize();
    user = new User();
    user.email = 'test@example.com';
    user.password = await hashPassword('oldPassword123');
    user = await AppDataSource.manager.save(user);
    token = 'token';
})

  afterAll(async () => {
    await AppDataSource.manager.delete(User, { id: user.id });
    await AppDataSource.destroy();
  });

  it('should update the password successfully', async () => {
    const res = await request(server)
      .put('/api/v1/user/update-password')
      .set('Authorization', token)
      .send({ current_password: 'oldPassword123', new_password: 'newSecurePassword456' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Password updated successfully.');
  });

  it('should return error for incorrect current password', async () => {
    const res = await request(server)
      .put('/api/v1/user/update-password')
      .set('Authorization', token)
      .send({ current_password: 'wrongPassword', new_password: 'newSecurePassword456' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('unsuccessful');
    expect(res.body.message).toBe('Current password is incorrect.');
  });

  it('should return error for missing fields', async () => {
    const res = await request(server)
      .put('/api/v1/user/update-password')
      .set('Authorization', token)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('unsuccessful');
    expect(res.body.message).toBe('Current password and new password must be provided.');
  });

  it('should return error for empty new password', async () => {
    const res = await request(server)
      .put('/api/v1/user/update-password')
      .set('Authorization', token)
      .send({ current_password: 'oldPassword123', new_password: '' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('unsuccessful');
    expect(res.body.message).toBe('New password cannot be empty.');
  });
});
