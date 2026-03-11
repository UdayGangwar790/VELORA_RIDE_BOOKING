const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {

  try {

    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }

    const user = await userModel.create({
      fullName: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      email: email.trim().toLowerCase(),
      password,
    });

    return user;

  } catch (error) {

    throw new Error(error.message);

  }

};