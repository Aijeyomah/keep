export default {
  userSignUp: `INSERT INTO users (
     id,
     first_name,
     last_name,
     email_address,
     password)
    VALUES($1, $2, $3, $4, $5) RETURNING id, first_name, first_name,email_address;`,

  UserSignIn: 'SELECT * FROM users WHERE email_address=($1) AND password ',

  fetchUserByEmail: 'SELECT * FROM users WHERE email_address=($1)'
};
