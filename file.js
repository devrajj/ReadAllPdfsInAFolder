const fs = require('fs');
const path = require('path');
const { PdfReader } = require("pdfreader");
let folderPath = path.join(__dirname + '/pdfFolder');
const Promise = require('bluebird');
let searchString = 'PDF';
searchString = searchString.toUpperCase();
let globalObj = {};
function readFromDirectory(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, function (err, filenames) {
      if (err) {
        return reject(err);
      }
      return resolve(filenames);
    })
  });
};
function readFileInADirectory(fileName) {
  return new Promise((resolve, reject) => {
    let actualFile = path.join(folderPath + '/' + fileName);
    return fs.readFile(actualFile, (err, fileContent) => {
      if (err) {
        return reject(err);
      }
      new PdfReader().parseBuffer(fileContent, (err, item) => {
        if (err) {
          return reject(err);
        }
        else if (!item) {
          return resolve(globalObj);
        }
        else if (item && item.text && item.text.toUpperCase().indexOf(searchString) >= 0) {
          if (globalObj[fileName]) {
            globalObj[fileName].push(item.text);
          } else {
            globalObj[fileName] = [];
            globalObj[fileName].push(item.text);
          }
        }
      });
    })
  })
};
readFromDirectory(folderPath)
  .then((data) => {
    let fileNames = data;
    return Promise.each(fileNames, readFileInADirectory)
  })
  .then(() => {
    console.log('globalObj:', globalObj);
  })
  .catch((err) => {
    console.log('err111:', err);
    return Promise.reject(err);
  })
