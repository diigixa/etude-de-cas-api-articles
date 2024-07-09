const request = require('supertest');
const { app } = require('../server'); 
const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const Article = require('../api/articles/articles.schema');
const jwt = require('jsonwebtoken');
const config = require('../config');

describe('Articles API', () => {
  let token;
  const USER_ID = "fake";
  const MOCK_USER = {
    _id: USER_ID,
    username: "testuser",
    email: "testuser@example.com",
    password: "password",
    role: "user"
  };

  const MOCK_ARTICLE = {
    _id: "fakearticle",
    title: "Test Article",
    content: "Test Content",
    user: USER_ID,
    status: "draft"
  };

  beforeEach(() => {
    token = jwt.sign({ _id: USER_ID }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    mockingoose(Article).toReturn([MOCK_ARTICLE], "find");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndUpdate");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndDelete");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should create an article", async () => {
    const res = await request(app)
      .post('/api/articles')
      .send({ title: 'Test Article', content: 'Test Content', status: 'draft' })
      .set('x-access-token', token); 
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  test("should update an article", async () => {
    const res = await request(app)
      .put(`/api/articles/${MOCK_ARTICLE._id}`)
      .send({ title: 'Updated Title' })
      .set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Title');
  });

  test("should delete an article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${MOCK_ARTICLE._id}`)
      .set('x-access-token', token);
    expect(res.statusCode).toEqual(204);
  });

  test("should get articles of a user", async () => {
    const res = await request(app)
      .get(`/api/users/${USER_ID}/articles`)
      .set('x-access-token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
