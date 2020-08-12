import Helper from '../utils/helpers';
import db from '../db';
import queries from '../db/queries/users';

const { userSignUp } = queries;
/**
 *
 *
 * @class UserModel
 */
class UserModel {
  /**
   *Creates an instance of UserModel.
   * @param {object} options - contains the require properties for creating a user instance
   * @returns  {UserModel} - return an instance of a userModel
   * @memberof UserModel
   */
  constructor(options) {
    this.id = Helper.generateId();
    this.first_name = options.firstName;
    this.last_name = options.lastName;
    this.email_address = options.email;
    this.password = options.hash;
  }

/**
 *
 *
 * @memberof UserModel
 */
  async save() {
    try {
      return db.oneOrNone(userSignUp, [
        this.id,
        this.first_name,
        this.last_name,
        this.email_address,
        this.password,
      ]);
    } catch (error) {
      console.log(error);
    }
  }
}
export default UserModel;
