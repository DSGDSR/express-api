const mongoose = require('mongoose');
const supertest = require('supertest');
const { app, server } = require('../src/app');
const User = mongoose.model('User');
const Session = mongoose.model('Session');

describe('Sessions:', () => {
    let api;
    let user;
    let authToken;

    const testUser = {
        username: 'IT_Test_Sessions',
        email: 'IT_Test_Sessions@test.test',
        password: 'test'
    };

    beforeAll(async() => {
        await server.close();
        await mongoose.connect(process.env.DB_TEST_URI);
        api = supertest(app);

        // Create user for auth
        const register = await api.post('/api/user/register').send({ user: testUser });
        authToken = register.body.data.token;

        // Get whole user object
        user = await User.findOne({ username: testUser.username });
    });

    afterAll(async() => {
        await User.deleteMany({});
        await Session.deleteMany({});
        await mongoose.disconnect();
    });
    
    describe('GET => Get all sessions:', () => {
        let response;

        beforeAll(async() => {
            response = await api.get('/api/sessions');
        });

        test('should return a success response as a json', (done) => {
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(/application\/json/.test(response.headers['content-type'])).toBe(true);
            done();
        });

        test('should return a list of objects as data', (done) => {
            expect(response.body.data).toBeDefined();
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBe(0);
            done();
        });
    });
    
    describe('POST/GET => Create session and GET by id:', () => {
        const sessionObject = {
            name: 'Sala M100 - Vicente perro',
            date: 'Wed, 03 Nov 2021 14:02:37 GMT', // validate date
            active: true
        };

        describe('POST session without token:', () => {
            test('should unauthorize to create session if no token', async() => {
                await api.post('/api/sessions').send(sessionObject).expect(401);
            });
        });

        describe('POST session with token:', () => {
            let session;

            beforeAll(async() => {
                session = await api
                    .post('/api/sessions')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(sessionObject);
            });

            test('should return a success response as a json', () => {
                expect(session.status).toBe(200);
                expect(session.body.success).toBe(true);
                expect(/application\/json/.test(session.headers['content-type'])).toBe(true);

            });

            test('should return the session when calling GET all sessions', async() => {
                const sessions = await api.get('/api/sessions');
                expect(sessions.body.data.length).toBe(1);
            });

            test('should map user id to session \'createdBy\' value', () => {
                expect(session.body.data.name).toBe(sessionObject.name);
                expect(session.body.data.createdBy).toBe(user.id);
            });
        });
    });
});
