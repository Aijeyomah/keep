/* eslint-disable valid-jsdoc */
import { signUpSchema, loginSchema } from '../../validation';
import userServices from '../../services/user';
import Helper from '../../utils/helpers';
import { serverError, unauthorizedError, conflictError, notFoundError } from '../../utils/messages';

const { verifyToken } = Helper;
const { getUserByEmail } = userServices;
/**
 *
 *
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * @static
   * @param {object} req - request from the client
   * @param {object} res - response object from the server
   * @param {Function} next - calls the next handle
   * @memberof AuthMiddleware
   */
  static async validatSignUpFields(req, res, next) {
    try {
      await signUpSchema.validateAsync(req.body);
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * @static
   * @param {object} req - request from the client
   * @param {object} res - response object from the server
   * @param {Function} next - calls the next handle
   * @memberof AuthMiddleware
   */
  static async validateLoginField(req, res, next) {
    try {
      await loginSchema.validateAsync(req.body);
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * Checks if a specific already exist for a staff account.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static async signUpEmailValidator(req, res, next) {
    try {
      const user = await getUserByEmail(req.body.email);
      if (user) {
        return conflictError(res, 'username already exist');
      }
      next();
    } catch (e) {
      serverError(res, e.message);
    }
  }

  /**
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   */
  static async loginEmailValidator(req, res, next) {
    try {
      const user = await getUserByEmail(req.body.email);
      if (!user) {
        return notFoundError(res, 'invalid login details');
      }
      req.user = user;
      next();
    } catch (e) {
      serverError(res, e.message);
    }
  }

  /**
   *Checks for token in the authorization and x-access-token header properties.
   * @static
   * @param {object} authorization The headers object
   * @returns {string || null}
   * @memberof AuthMiddleware
   */
  static checkAuthorization(authorization) {
    let bearerToken = null;
    if (authorization) {
      const token = authorization.split(' ')[1];
      bearerToken = token || authorization;
    }
    return bearerToken;
  }

  /**
   * Aggregates a search for the access token in a number of places.
   * @static
   * @private
   * @param {Request} req - The express request object.
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   */
  static checkToken(req) {
    const {
      headers: { authorization },
    } = req;
    const bearerToken = AuthMiddleware.checkAuthorization(authorization);
    return (
      bearerToken
      || req.headers['x-access-token']
      || req.headers.token
      || req.body.token
    );
  }

  /**
 *
 *
 * @static
@param {Request} req - The express request object
  * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
 * @memberof AuthMiddleware
 */
  static authenticate(req, res, next) {
    const token = AuthMiddleware.checkToken(req);
    if (!token) {
      return unauthorizedError(res, 'unathourized user');
    }
    try {
      const decoded = verifyToken(token);
      req.locals = decoded;
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  static async getUserData(req, res) {
    const { email_address } = req.locals.email_address;
    try {
      const data = await getUserByEmail(email_address);
      return data;
    } catch (error) {
      serverError(res, error.message);
    }
  }
}
export default AuthMiddleware;
