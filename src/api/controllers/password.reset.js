import { hashSync, genSaltSync } from 'bcrypt';
import models from '../models/index';
import mailer from '../../helpers/Mailer';
import status from '../../helpers/constants/status.codes';

const { User } = models;
const { API_BASE_URL, BCRYPT_HASH_ROUNDS } = process.env;
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
	 *  @returns {Boolean} true
	 */
  static async sendRecoveryEmail(req, res) {
    // Initialising variables
    const result = {};
    const { username, email } = req.user;

    await mailer(`Password recovery for ${email}`, 'Password recovery', email, 'notifications', {
      email,
      link: `${API_BASE_URL}/api/password-reset`,
      userName: username,
      buttonText: 'RESET',
      message: `You are receiving this email beacause you've requested the recovery 
      of your Authors Heaven password. Kindly click the button below.`
    });

    // Sending the result
    result.status = status.OK;
    result.message =			'Password reset instructions have been sent '
			+ "to your account's primary email address. Please check the spam if you don't see the email";
    res.status(status.OK).json(result);
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
    const salt = genSaltSync(parseFloat(BCRYPT_HASH_ROUNDS));
    const hashedPassword = hashSync(userPassword, salt);

    await User.update({
      password: hashedPassword
    },
    {
      where: {
        email: userEmail
      }
    });

    // Sending the result
    result.status = status.OK;
    result.message = 'Password reset sucessfully';
    res.status(status.OK).json(result);
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
    const { userEmail } = req;

    // Sending the result
    result.status = status.OK;
    result.message = 'Please provide your new password';
    result.data = {
      email: userEmail
    };
    res.status(status.OK).json(result);
  }
}
