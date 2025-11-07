"use strict";
const { rmSync, renameSync, } = require("node:fs");

exports.removeFile = async path => {
  rmSync(path);
};

// 3MB
exports.fileSize = 3145728;

exports.profilePhotoAsset = fileName => {
  return `public/images/profile/${fileName}`;
};

exports.defaultAvatarName = "default-avatar.webp";

/**
 * @param {Object} file
 */
exports.getUploadPhotoError = file => {
  if (undefined === file) {
    return "Please select 1 image file.";
  }

  if (null === file.mimetype.match(/(jpg|jpeg|png|webp)$/i)) {
    return "The product photo mimetype must match one of jpg, jpeg, png or webp.";
  }

  if (file.size > exports.fileSize) {
    return "The product photo size must not exceed 3.5MB";
  }

  return false;
};

/**
 * @param {string} from - Relavive path
 * @param {string} to - Relative path
 */
exports.moveFile = (from, to) => {
  renameSync(from, to);
};