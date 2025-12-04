"use strict";
const db = require("../../../../models/V1");
const { status, } = require("http-status");
const multer = require("multer");
const {
  message400,
  message500,
  message200,
  message404,
} = require("../../../../utils/httpResponses");
const { defaultConfig, } = require("../../../../utils/uploads");
const { getUploadPhotoError, moveFile, removeFile, profilePhotoAsset, defaultAvatarName, } = require("../../../../utils/file");
const { nodeEnv, } = require("../../../../config");
const { encrypt } = require("../../../../utils/tokens");
const asyncHandler = require("express-async-handler");

const upload = multer(defaultConfig)
  .single("avatar");

const createUser = asyncHandler(async (req, res) => {
  const inputError = db.sequelize.models
    .user
    .getRegisterError(req.body);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }
  
  const cleanData = db.sequelize.models
    .user
    .getCreateUserData({
      firstName: req.bodyString("firstName"),
      lastName: req.bodyString("lastName"),
      email: req.bodyString("email"),
      password: req.bodyString("password"),
    });
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    throw new Error(message400);
  }
  
  const emailExists = await db.sequelize.models
    .user
    .emailExists(
      cleanData.email,
    );
  if (true === emailExists) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(
      "The email field has already been taken."
    );
  }
  
  const userInsert = await db.sequelize.models
    .user
    .createUser(
      cleanData,
    );
  if (false === userInsert) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }

  const newUser = await db.sequelize.models.user.getUser(
    userInsert.userID,
  );
  if (false === newUser) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }

  res.status(status.OK);
  return res.json({
    user: db.sequelize.models.user
      .getFormattedUserData(newUser),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const inputError = db.sequelize.models
    .user
    .getLoginError(req.body);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }

  const cleanData = db.sequelize.models
    .user
    .getCleanLoginData(
      req.bodyString("email"),
      req.bodyString("password"),
    );
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    throw new Error(message400);
  }

  const emailExists = db.sequelize.models.user
    .emailExists(cleanData.email);
  if (false === emailExists) {
    res.status(status.BAD_REQUEST);
    throw new Error(
      "The email given does not exist in our records.",
    );
  }
  
  const user = await db.sequelize.models.user
    .getUserByEmail(
      cleanData.email,
    );
  if (false === user) {
    res.status(status.BAD_REQUEST);
    throw new Error(
      "The email is not in our records.",
    );
  }
  
  const successLogin = await db.sequelize.models.user
    .loginUser(
      cleanData.password,
      user.password,
      user.passwordSalt,
    );
  if (false === successLogin) {
    res.status(status.BAD_REQUEST);
    throw new Error(
      "The email and password combination did not match."
    );
  }

  const authTokenInsert = await db.sequelize.models
    .userToken
    .createAuthToken(user.id);
  if (false === authTokenInsert) {
    res.status(status.BAD_REQUEST);
    throw new Error(message500);
  }

  const authTokenResult = await db.sequelize.models
    .userToken
    .getAuthToken(
      authTokenInsert.authTokenID,
    );
  if (false === authTokenResult) {
    res.status(status.BAD_REQUEST);
    throw new Error(message500);
  }

  await db.sequelize.models.user.updateUserTimestamp(
    user.id,
  );
  
  res.status(status.OK);
  return res.json({
    data: {
      user,
      authToken: authTokenResult.token,
    },
  });
});

const authoriseUser = asyncHandler(async (req, res) => {
  const userFromAuthToken = await db.sequelize.models.user.getUserByAuthToken(
    req.session.extractedToken,
  );
  if (false === userFromAuthToken) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }
  
  await db.sequelize.models.user.updateUserTimestamp(
    req.session.userID,
  );
  
  res.status(status.OK);
  return res.json({
    user: userFromAuthToken,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await db.sequelize.models.user
    .getUserByAuthToken(
      req.session.extractedToken,
    );
  if (false === user) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }
  
  const logoutUser = db.sequelize.models.userToken.logoutUser(
    user.id,
    req.session.extractedToken,
  );
  if (false === logoutUser) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }
  
  await db.sequelize.models.user.updateUserTimestamp(
    req.session.userID,
  );

  res.status(status.OK);
  return res.json({
    message: message200,
  });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(status.INTERNAL_SERVER_ERROR);
      throw new Error(err.message);
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(status.INTERNAL_SERVER_ERROR);
      throw new Error(message500);
    }

    if ("production" !== nodeEnv) {
      console.log(req.file);
    }

    const photoError = getUploadPhotoError(
      req.file,
    );
    if (false !== photoError) {
      res.status(status.BAD_REQUEST);
      throw new Error(photoError);
    }
    
    const fileExtension = req.file.mimetype
      .slice(1 + req.file.mimetype.indexOf("/"));
    const newFileName = req.file.filename + "." + fileExtension;

    try {
      moveFile(
        "uploads/"+req.file.filename,
        "public/images/profile/"+newFileName,
      );
    } catch (err) {
      res.status(status.INTERNAL_SERVER_ERROR);
      throw new Error(message500);
    }

    const user = await db.sequelize.models
      .user
      .getRawUserByID(
        req.session.userID,
      );
    if (false === user) {
      res.status(status.INTERNAL_SERVER_ERROR);
      throw new Error(message500);
    }
    
    if (
      user.avatarName &&
      user.avatarName !== defaultAvatarName
    ) {
      removeFile(profilePhotoAsset(user.avatarName));
    }

    const updateDB = await db.sequelize.models
      .user
      .updateUser(
        req.session.userID,
        {
          avatarName: newFileName,
          firstName: null,
          lastName: null,
          email: null,
          password: null,
          passwordSalt: null,
        },
      );
    if (false === updateDB) {
      res.status(status.INTERNAL_SERVER_ERROR);
      throw new Error(message500);
    }

    return res.json({ message: message200 });
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const inputError = await db.sequelize.models
    .user
    .getUpdateUserError(
      req.session.userID,
      req.body,
    );
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    throw new Error(inputError);
  }

  const cleanData = await db.sequelize.models
    .user
    .getUpdateUserData({
      firstName: req.bodyString("firstName"),
      lastName: req.bodyString("lastName"),
      email: req.bodyString("email"),
      password: req.bodyString("password"),
    });
  
  let newPassword, newPasswordSalt;
  if (cleanData.password) {
    const { salt, hash, } = encrypt(cleanData.password);
    newPassword = hash;
    newPasswordSalt = salt;
  }

  const updateUser = await db.sequelize.models
    .user
    .updateUser(
      req.session.userID,
      {
        firstName: cleanData.firstName,
        lastName: cleanData.lastName,
        email: cleanData.email,
        password: newPassword ?
          newPassword :
          null,
        passwordSalt: newPasswordSalt ?
          newPasswordSalt :
          null,
        avatarName: null,
      }
    );
  if (false === updateUser) {
    res.status(status.INTERNAL_SERVER_ERROR);
    throw new Error(message500);
  }

  return res.json({ message: message200 });
});

const removeAvatar = asyncHandler(async (req, res) => {
  const user = await db.sequelize.models
    .user
    .getRawUserByID(
      req.session.userID,
    );
  if (false === user) {
    res.status(status.NOT_FOUND);
    throw new Error(message404);
  }

  if (
    user.avatarName !== null &&
    user.avatarName !== defaultAvatarName
  ) {
    removeFile(profilePhotoAsset(user.avatarName));

    const resetAvatar = await db.sequelize.models
      .user
      .resetAvatar(
        req.session.userID,
      );
    if (false === resetAvatar) {
      res.status(status.INTERNAL_SERVER_ERROR);
      throw new Error(message500);
    }
  }

  return res.json({ message: message200 });
});

module.exports = {
  createUser,
  loginUser,
  authoriseUser,
  logoutUser,
  uploadAvatar,
  updateUser,
  removeAvatar,
};