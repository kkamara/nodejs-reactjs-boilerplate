const { rmSync, } = require("node:fs");

exports.removeFile = async path => {
  rmSync(path);
};

// 3MB
exports.fileSize = 3145728;

exports.profilePhotoAsset = fileName => {
  return `public/images/profile/${fileName}`;
};