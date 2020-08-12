import userServices from '../../services/user';
import UserModel from '../../models/user';
import { DBError, constants, ApiError } from '../../utils';
import Helper from '../../utils/helpers';
import { successResponses, serverError } from '../../utils/messages';

const { successResponse, addTokenToData, comparePassword } = Helper;
const { CREATE_USER_SUCCESSFULLY, CREATE_USER_FAILED, LOGIN_USER_SUCCESSFULLY } = constants;

/**
 *
 *
 * @class AuthController
 */
class AuthController {
  /**
   *
   *
   * @static
   * @param {object} req - request from the endpoint
   * @param {object} res -a response returned by the method
   * @param {Function} next - calls the next handler
   * @returns { JSON } A JSON response with the registered user's details.
   * @memberof authController
   */
  static async signup(req, res, next) {
    const { password } = req.body;
    const { hash } = await Helper.hashPassword(password);
    req.body.hash = hash;
    try {
      const user = await new UserModel(req.body);
      // console.log(user);

      const { id, first_name, last_name, email_address } = await user.save();

      return successResponse(res, {
        status: 201,
        message: CREATE_USER_SUCCESSFULLY,
        data: { id, first_name, last_name, email_address },
      });
    } catch (error) {
      console.log(error);
      next(new ApiError({ message: CREATE_USER_FAILED }));
    }
  }

  /**
   * @static
   * @param {object} req - request from the endpoint
   * @param {object} res -a response returned by the method
   * @param {Function} next - calls the next handler
   * @returns {JSON} - A JSON response with a mesaage and user's details
   * @memberof AuthController
   */
  static async signin(req, res) {
    try {
      const { user, body } = req;
      const isAuthenticUser = comparePassword(body.password, req.user.password);
      if (!isAuthenticUser) {
        return res.status(409).json({ msg: 'invalid login' });
      }
      const data = addTokenToData(user, true);
      return successResponses(res, data, 'Login successful');
    } catch (error) {
      serverError(res, error.message);
    }
  }
}

export default AuthController;
