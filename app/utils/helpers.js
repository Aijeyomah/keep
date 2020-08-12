/* eslint-disable valid-jsdoc */
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/env";
import constants from "./constants";
import db from "../db";

const { SECRET } = config;
const { SUCCESS, SUCCESS_RESPONSE } = constants;

/**
 * helper method
 *
 * @class Helper
 */
class Helper {
  /**
   * It generates a uniqueId.
   * @static
   * @memberof Helper
   * @returns {String} - A unique string.
   */
  static generateId() {
    return uuidV4();
  }

  /**
   * This method will help in generating a salt and hash from a  user's password
   * @static
   * @param {string} plainPassword - password to be encrypted
   * @returns {object}- returns an object containing the salt and hashof a password
   * @memberof Helper
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return {
      hash,
    };
  }

  /**
   *
   *
   * @static
   * @param {*} plainPassword
   * @param {*} hashedPassword
   * @returns
   * @memberof Helper
   */
  static comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  /**
   * Synchronously signs the given payload into a JSON Web Token string.
   * @static
   * @param {string | number | Buffer | object} payload - payload to sign
   * @param {string | number} expiresIn - Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 2 hours.
   * @memberof Helper
   * @returns {string} - JWT Token
   */
  static generateToken(payload, expiresIn = "2h") {
    return jwt.sign(payload, SECRET, { expiresIn });
  }

  /**
   *  This verify the JWT token with the secret with which the token was issued with
   * @static
   * @memberof Helper
   * @param {string} token - JWT Token
   * @returns - {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   */
  static verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
  /**
   *
   *
   * @static
   * @param {object}user - New User Instance.
   * @returns {object} - A new object containing essential user properties and jwt token.
   * @memberof Helper
   */

  static addTokenToData(user) {
    const { id, first_name, last_name, email_address } = user;
    const token = Helper.generateToken({
      id,
      first_name,
      last_name,
      email_address,
    });
    return {
      token,
      id,
      first_name,
      last_name,
      email_address,
    };
  }

  /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - An object containing response properties.
   * @param {object} options.data - The payload.
   * @param {string} options.message -  HTTP Status code.
   * @param {number} options.code -  HTTP Status code.
   * @memberof Helpers
   * @returns {JSON} - A JSON success response.
   */
  static successResponse(
    res,
    { data, message = SUCCESS_RESPONSE, code = 201 }
  ) {
    return res.status(code).json({
      status: SUCCESS,
      message,
      data,
    });
  }

  /**
   * Fetches a pagination collection of tasks.
   * @static
   * @param {Object} options - configuration options.
   * @param {number} options.page - Current page e.g: 1 represents first
   * 30 records by default and 2 represents the next 30 records.
   * @param {number} options.limit - Max number of records.
   * @param {number} options.getCount - Max number of records.
   * @param {number} options.getResources - Max number of records.
   * @param {Array} options.params - Extra parameters for the get resources query.
   * @param {Array} options.countParams - Extra parameters for the get counts query.
   * @memberof Helper
   * @returns {Promise<Any>} - Returns a promise array of the count anf the resources
   */
  static async fetchItemsByPage({
    page,
    limit,
    getCount,
    getUserTask,
    params = [],
    countParams = [],
  }) {
    const offset = (page - 1) * limit;
    const fetchCount = db.one(getCount, [...countParams]);
    const fetchTask = db.any(getUserTask, [offset, limit, ...params]);
    return Promise.all([fetchCount, fetchTask]);
  }

  static calcPages(total, limit) {
    const displayPage = Math.floor(total / limit);
    return total % limit ? displayPage + 1 : displayPage;
  }
}
export default Helper;
