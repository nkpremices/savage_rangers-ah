import { hashSync, genSaltSync } from 'bcrypt';
import models from '../models/index';
import mailer from '../../helpers/Mailer';
import environment from '../../configs/environments';

const { User } = models;
const env = environment.currentEnv;

/**
 * containing aal controllers of the signup process
 *
 * @export
 * @class Auth
 */
export default class PasswordReset {
  /**
   * A controller to send an email to a user
   * requesting password recovery
   *
   * @param {Object} req - the request object
   * @param {Object} res - the result object
   * @returns {Boolean} true
   */
  static async sendRecoveryEmail(req, res) {
    // Initialising variables
    const result = {};
    const { username, email } = req.user;

    await mailer(`Password recovery for ${email}`, 'Password recovery', email, 'notifications', {
      email,
      link: `${env.baseUrl}/api/password-reset`,
      userName: username,
      buttonText: 'RESET',
      message:
        "You are receiving this email beacause you've requested the recovery "
        + 'of your Authors Heaven password. Kindly click the button below.'
    });

    // Sending the result
    result.status = 200;
    result.message = 'Password reset instructions have been sent '
      + "to your account's primary email address. Please check the spam if you don't see the email";
    res.status(200).json(result);
  }

  /**
   * A controller update the users password
   *
   * @param {Object} req - the request object
   * @param {Object} res - the result object
   * @returns {Boolean} true
   */
  static async updatePassword(req, res) {
    // Initialising variables
    const result = {};
    const userEmail = req.params.email;
    const userPassword = req.body.password;
    const salt = genSaltSync(parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10);
    const hashedPassword = hashSync(userPassword, salt);

    const user = await User.update(
      {
        password: hashedPassword
      },
      {
        where: {
          email: userEmail
        }
      }
    );

    // Sending the result
    result.status = 200;
    result.message = 'Password reset sucessfully';
    result.user = user;
    res.status(200).json(result);
  }

  /**
   * A controller to send an approval to the user to
   * reset the password
   *
   * @param {Object} req - the request object
   * @param {Object} res - the result object
   * @returns {Boolean} true
   */
  static async verifyRecoveryLink(req, res) {
    // Initialising variables
    const result = {};
    const status = 200;
    const { userEmail } = req;

    // Sending the result
    result.status = status;
    result.message = 'Please provide your new password';
    result.data = {
      email: userEmail
    };
    res.status(status).json(result);
  }
}