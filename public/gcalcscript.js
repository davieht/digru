const _schoolId = 'oedi';

const _firstNameCol = 0;
const _lastNameCol = 1;
const _hashCol = 3;
const _tokenCol = 4;
const _loginFlagCol = 5;
const _defectCol = 6;
const _extraCol = 7;
const _recapCol = 8;
const _feedbackCol = 9;
const _gradeCol = 10;
const _pointsCol = 13;
const _chapterStartCol = 15;

const _chapterNameRow = 0;
const _chapterActiveRow = 1;
const _chapterDueDateRow = 2;


function doPost(e) {
  try {
    const jsonData = JSON.parse(e.postData.contents);

    const { route, className } = jsonData;

    if (!route) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Missing route parameter' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (!className) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Missing className parameter' + jsonData }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let returnData = null;
    switch (route) {
      case 'login': {
        const { _1, _2, token } = jsonData;
        returnData = postLogin(className, token);
        break;
      }
      case 'quiz': {
        const { _1, _2, hash, quizId, score, total } = jsonData;
        returnData = postQuiz(className, hash, quizId, score, total);
        break;
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, data: returnData }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (error) {
    Logger.log("Error: " + error.message);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testPostFeedback() {
  Logger.log(postFeedback('1A', 'SpCccOhrhy3XXMPf', 'p'));
}

function postFeedback(className, studentId, rating, comment = "") {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);

  if (!sheet) {
    throw new Error("Class not found");
  }

  const data = sheet.getDataRange().getValues(); // Get all data

  // Find the student row
  const studentRowIndex = data.findIndex(row => row[_hashCol] == studentId);

  if (studentRowIndex === -1) {
    throw new Error(`Student with ID ${studentId} not found.`);
  }

  switch (rating) {
    case 'p': return update(studentRowIndex, _feedbackCol, 1, false, "plus");
    case 'm': return update(studentRowIndex, _feedbackCol, -1, false, "minus");
    case 'wp': return update(studentRowIndex, _recapCol, 1, false, "plus");
    case 'wm': return update(studentRowIndex, _recapCol, -1, false, "minus");
    case 'l': return update(studentRowIndex, _feedbackCol, -1, false, "laptop");
    case 'd': return update(studentRowIndex, _feedbackCol, 0, false, "missbehave");
    case 'dt': return update(studentRowIndex, _defectCol, true, true);
    case 'df': return update(studentRowIndex, _defectCol, false, true);
    case 'et': return update(studentRowIndex, _extraCol, true, true);
    case 'ef': return update(studentRowIndex, _extraCol, false, true);
  }

  function update(row, col, value, onlySet = false, comment = undefined) {
    // Get the current feedback and append the new rating
    const currentFeedback = data[row][col] || "";
    const newFeedback = onlySet ? value : currentFeedback + value;

    // Update the cell with the new feedback
    const cell = sheet.getRange(row + 1, col + 1);
    cell.setValue(newFeedback);

    // Append new note while keeping existing notes
    if (comment) {
      // Get current date and time in German format
      const now = new Date();
      const formattedDate = now.toLocaleString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });

      const existingNote = cell.getNote();
      const newNote = `${existingNote ? existingNote + "\n" : ""}${comment} - ${formattedDate}`;
      cell.setNote(newNote);
    }

    return `Feedback added for Student ID ${studentId}: ${newFeedback}`;
  }
}

function testPostLogin() {
  Logger.log(postLogin('1A', 'Ln5qba'));
}

function postLogin(className, token) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);

  // If the sheet doesn't exist, return an error
  if (!sheet) {
    throw new Error('Class not found');
  }

  const data = sheet.getDataRange().getValues(); // Get all data from the sheet
  const tokenColumnIndex = _tokenCol; // Column where tokens are stored (assuming _tokenCol is defined)

  // Find the row index where the token matches
  const userRowIndex = data.findIndex(row => row[tokenColumnIndex] === token);

  if (userRowIndex === -1) {
    throw new Error(`User not found.`);
  }

  // Google Sheets is 1-based, so we adjust by adding 1
  // Set "true" in column 2 (B)
  sheet.getRange(userRowIndex + 1, _loginFlagCol + 1).setValue(true);

  return { schoolId: _schoolId, className: className, hash: data[userRowIndex][_hashCol] };
}

// function postLogin(className, token) {
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);

//   // If the sheet doesn't exist, return an error
//   if (!sheet) {
//     throw new Error('Class not found');
//   }

//   const data = sheet.getDataRange().getValues(); // Get all data from the sheet
//   const userRow = data.find(row => row[_tokenCol] === token); // Find row matching name

//   if (!userRow) {
//     throw new Error(`User not found.`);
//   }

//   sheet.getRange(userRow, 2).setValue(true);

//   return { schoolId: _schoolId, className: className, hash: userRow[2] };
// }

function testPostQuiz() {
  Logger.log(postQuiz('1A', 'SpCccOhrhy3XXMPf', 'intro', 3, 4));
}

function postQuiz(className, hash, quizId, score, total) {
  try {
    // // Parse the CSV string
    // const parts = csvString.split(";");
    // Logger.log('Parsed CSV parts: ' + parts.join(", "));  // Log the split CSV parts

    // if (parts.length !== 9) {
    //   Logger.log("Invalid CSV format");
    //   return "Invalid CSV format. Length: " + parts.length;
    // }

    // const [className, dateStr, firstName, lastName, correct, total, quizId, hash] = parts;

    const insertDate = new Date();

    // Log the parsed components
    Logger.log(`Class: ${className}, Date: ${insertDate.toISOString()}, score: ${score}, total: ${total}, Quiz ID: ${quizId}, Hash: ${hash}`);

    // Open the target spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);

    if (sheet === null) {
      Logger.log("Invalid sheet name");
      return "Invalid sheet name";
    }

    // const parsedDate = new Date(dateStr);

    // // Step 3: Check if the parsed date is valid
    // if (isNaN(parsedDate.getTime())) {
    //   Logger.log("Invalid date format");
    //   return "Invalid date format";
    // }

    // Find the row with the matching first and last name
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    let targetRow = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i][_hashCol] === hash) {
        targetRow = i + 1; // Row index (1-based)
        break;
      }
    }

    if (targetRow === -1) {
      Logger.log("Name not found");
      return "Name not found";
    }

    // Find the reference name in the header row
    const headerRow = values[_chapterNameRow];
    const referenceColumnIndex = headerRow.indexOf(quizId);

    if (referenceColumnIndex === -1) {
      Logger.log("Reference name not found");
      return "Reference name not found";
    }

    const cellToInsert = sheet.getRange(targetRow, referenceColumnIndex + 1);

    // check the deadline
    const daysDeadline = 0;
    const daysDeadlineSick = 14;

    const dueDate = sheet.getRange(_chapterDueDateRow + 1, referenceColumnIndex + 1).getValue();

    let deadlineDays = (cellToInsert.getValue() === 's') ? daysDeadlineSick : daysDeadline;
    dueDate.setDate(dueDate.getDate() + deadlineDays);
    dueDate.setHours(0, 0, 0, 0);

    Logger.log(dueDate);

    let delayed = insertDate > dueDate;

    const resultValue = (delayed ? 50 : 100) * ((score / total) + (total === score ? .25 : 0));

    // Dont insert if newer value is higher
    if (cellToInsert.getValue() === 's' || resultValue > cellToInsert.getValue())
      cellToInsert.setValue(resultValue);

    Logger.log("Value inserted successfully");

    return "Value inserted successfully";

  } catch (error) {
    Logger.log("Error: " + error.message);
    return "Error: " + error.message;
  }
}

function doGet(e) {
  // Get the className from the URL parameters
  var { route, className, hash } = e.parameter; // e.g., className=1A

  if (!route) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Missing route parameter' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Validate the className parameter
  if (!className) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Missing className parameter' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    let output = null;

    switch (route) {
      case 'chapters':
        output = getChapters(className);
        break;
      case 'user':
        output = getUser(className, hash);
        break;
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, data: output }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testGetUser() {
  Logger.log(getUser('1A', 'SpCccOhrhy3XXMPf'));
}

function getUser(className, hash) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);

  // If the sheet doesn't exist, return an error
  if (!sheet) {
    throw new Error('Class not found');
  }

  const data = sheet.getDataRange().getValues(); // Get all data from the sheet

  const chapterNames = data[_chapterNameRow].slice(_chapterStartCol); // Get chapter names starting from column F
  const userRow = data.find(row => row[_hashCol] === hash); // Find row matching name

  if (!userRow) {
    throw new Error(`User not found in the sheet.`);
  }

  const result = {
    firstName: userRow[_firstNameCol],
    lastName: userRow[_lastNameCol],
    schoolId: _schoolId,
    className: className,
    chapters: {},
    points: userRow[_pointsCol],
    credits: userRow[_pointsCol],
    grade: userRow[_gradeCol],
    avatar: {}
  };

  const scores = userRow.slice(_chapterStartCol); // Get scores starting from column F

  chapterNames.forEach((chapter, index) => {
    if (chapter && scores[index] !== "") { // Only include non-empty chapters
      result.chapters[chapter] = scores[index] !== "" ? scores[index] : null; // Add score or null
    }
  });

  return result;
}

function testGetChapters() {
  Logger.log(getChapters('1A'));
}

function getChapters(className) {

  // Open the spreadsheet by className (sheetId) 
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);

  // If the sheet doesn't exist, return an error
  if (!sheet) {
    throw new Error('Class not found');
  }

  // Get the chapter names from the range E1:G1
  var chapterNames = sheet.getRange('P1:BA1').getValues()[0];

  // Get the activation status from the row below the chapter names (E2:G2)
  var activationFlags = sheet.getRange('P2:BA2').getValues()[0];

  var result = {};
  chapterNames.forEach((name, i) => {
    if (name && activationFlags[i] !== '') {
      result[name] = activationFlags[i] === true;
    }
  });

  // If no valid chapters found, return a message
  if (result.length === 0) {
    throw new Error('No active chapters found');
  }

  // Return the JSON response
  return result || {};
}


function onEdit(e) {
  return;
  const sheet = e.source.getActiveSheet();
  const editedRange = e.range;

  // Check if the edited cell is in the 3rd column (Column C)
  if (editedRange.getColumn() !== 3) {
    return; // Exit if the edited cell is not in Column C
  }

  // Get the row of the edited cell
  const row = editedRange.getRow();
  const csvString = editedRange.getValue().trim(); // Get and trim the input value

  // Ignore empty or "useless" input (delete should be ignored)
  if (!csvString) {
    return; // Exit if the input string is empty
  }

  // Parse the CSV string
  const parts = csvString.split(";");
  if (parts.length !== 6) {
    SpreadsheetApp.getUi().alert("Invalid CSV format. Please provide a valid input.");
    return;
  }

  const [dateStr, firstName, lastName, valueToInsert, , referenceName] = parts;

  // Validate the date string length
  if (dateStr.length !== 12) {
    SpreadsheetApp.getUi().alert("Invalid date string length. It must be exactly 12 characters.");
    sheet.getRange(row, 3).clearContent(); // Clear the input cell
    return;
  }

  // Validate the first name and last name in the same row
  const firstNameCell = sheet.getRange(row, 1).getValue(); // Column A
  const lastNameCell = sheet.getRange(row, 2).getValue(); // Column B

  if (firstNameCell !== firstName || lastNameCell !== lastName) {
    SpreadsheetApp.getUi().alert("First name or last name does not match the values in the row.");
    sheet.getRange(row, 3).clearContent(); // Clear the input cell
    return;
  }

  // Find the column for the reference name in the header row
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; // First row
  const referenceColumnIndex = headerRow.indexOf(referenceName);

  if (referenceColumnIndex === -1) {
    SpreadsheetApp.getUi().alert("Reference name not found in the header row.");
    sheet.getRange(row, 3).clearContent(); // Clear the input cell
    return;
  }

  // Insert the value in the correct cell
  const numericValue = parseFloat(valueToInsert);
  if (isNaN(numericValue)) {
    SpreadsheetApp.getUi().alert("Invalid value to insert. It must be numeric.");
    sheet.getRange(row, 3).clearContent(); // Clear the input cell
    return;
  }

  sheet.getRange(row, referenceColumnIndex + 1).setValue(numericValue);

  // Clear the input string after successful operation
  sheet.getRange(row, 3).clearContent();
  SpreadsheetApp.getUi().alert("Value inserted successfully!");
}

function MD5(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  var txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

function uniqueRandomIDs(rangeSize, length, prefix = "") {
  let ids = new Set();
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const allChars = upperChars + lowerChars + numberChars;

  function generateValidID() {
    let idArray = [];

    // Ensure at least one uppercase, one lowercase, and one number
    idArray.push(upperChars.charAt(Math.floor(Math.random() * upperChars.length)));
    idArray.push(lowerChars.charAt(Math.floor(Math.random() * lowerChars.length)));
    idArray.push(numberChars.charAt(Math.floor(Math.random() * numberChars.length)));

    // Fill remaining characters randomly
    for (let i = 3; i < length; i++) {
      idArray.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }

    // Shuffle the ID to avoid predictable patterns
    idArray.sort(() => Math.random() - 0.5);

    return idArray.join("");
  }

  while (ids.size < rangeSize) {
    ids.add(prefix+generateValidID());
  }

  // Convert to 2D array for Google Sheets (each ID in a separate row)
  return Array.from(ids).map(id => [id]);
}
