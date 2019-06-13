import chai from 'chai';
import chaihttp from 'chai-http';
import createToken from '../src/helpers/tokens/generate.token';
import environment from '../src/configs/environments';
import server from '../src/index';
import models from '../src/api/models';

const env = environment.currentEnv;

chai.use(chaihttp);
chai.should();


describe('GET /verifyEmail', () => {
  it('Should return a success message if the link is valid', (done) => {
    const user = {
      username: 'jake96',
      email: 'test@example.com',
      password: 'xxx23XX'
    };

    chai
      .request(server)
      .post('/api/auth/signup')
      .send(user)
      .end();

    const { username, email } = user;

    const verifytoken = createToken({ username, email }, env.secret);
    chai
      .request(server)
      .get(`/api/auth/verifyEmail/${verifytoken}`)
      .end(async (err, res) => {
        await res.should.have.status(200);
        await res.body.message.should.be.eq('Your email is successfully verified');
        done();
      });
  });

  it('Should return a message if a user doesn\'t exist', (done) => {
    const user = {
      username: 'jake96',
      email: 'test@example.com',
      password: 'xxx23XX'
    };

    chai
      .request(server)
      .post('/api/auth/signup')
      .send(user)
      .end();

    const { username } = user;

    const verifytoken = createToken({ username, email: 'dummy@email.com' }, env.secret);

    chai
      .request(server)
      .get(`/api/auth/verifyEmail/${verifytoken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.be.eq('User doesn\'t exist.');
        done();
      });
  });

  it('Should respond with a message if the token is invalid', (done) => {
    const user = {
      username: 'jake96',
      email: 'test@example.com',
      password: 'xxx23XX'
    };

    chai
      .request(server)
      .post('/api/auth/signup')
      .send(user)
      .end();

    const { username } = user;

    const verifytoken = createToken({ username }, 'env.secret');

    chai
      .request(server)
      .get(`/api/auth/verifyEmail/${verifytoken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.be.eq('The link provided is  corrupt, please request a new one or try to click it again');
        done();
      });
  });
});