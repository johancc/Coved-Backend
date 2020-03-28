const { google } = require('googleapis');
const mongoose = require('mongoose');
const fs = require('fs');
require("dotenv").config({path: '../.env'})

const { authorize } = require('./google_sheets')

const Tutor = require('../server/models/tutor')

// authenticate into google api and then upload mentor_data
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    // TODO: I dont like this starter code; probably want to rewrite to use async/await
    authorize(JSON.parse(content), upload_mentor_data); 
});
 
const MENTOR_SPREADSHEET = { 
    spreadsheetId: '1WF7al7SOlf3ntEUwVEa2BwQw10jfzwdfOO7lkM6QUvw',
    range: 'Form Responses 1' 
};

async function upload_mentor_data(auth) {
    const sheets = google.sheets({version: 'v4', auth});

    try {
        rows = (await sheets.spreadsheets.values.get(MENTOR_SPREADSHEET)).data.values;
        mentors = parse_spreadsheet(rows);
        put_mentors(mentors);
    } catch (err) {
        console.log('Google Sheets API Error: ' + err);
    }
}

/**
 * 
 * @param {*} rows 
 */
function parse_spreadsheet(rows) {
    tutors = [];

    rows.forEach(tutor_raw => {

        const tutor = {
            name : tutor_raw[1],
            email : tutor_raw[2],
            phone_num : tutor_raw[3],
            class_year : tutor_raw[4],
            college : tutor_raw[5],
            major : tutor_raw[6],
            location : tutor_raw[7],
            time_zone : tutor_raw[8], // phyllis computed hour offsets from EST 
            subjects_raw : tutor_raw[9],
            college_raw : tutor_raw[10],
            other_langs : tutor_raw[11],
            comments : tutor_raw[12],
            grade_levels : tutor_raw[13]
        };
        
        /** Cleaning up the form responses */

        // TODO: normalize phone number formats
        tutor.phone = tutor.phone_num;

        tutor.subjects = tutor.subjects_raw.split(",").map(str => str.trim());
        
        // TODO: college prep needs to become a list of strings 
        // tutor.college_prep = tutor.college_raw.split(",").map(str => str.trim());
        
        // TODO: figure out how to parse this
        // tutor.grade_levels_to_tutor = tutor.grade_levels.split(",").map(str => str.trim());

        // TODO: languages 
        // tutor.languages_spoken = tutor.other_langs;

        tutors.push(new Tutor(tutor));
    });

    return tutors;
}

/**
 * 
 * @param {*} mentors 
 */
async function put_mentors(tutors) {
    // TODO change connection URL after setting up your team database
    const mongoConnectionURL = process.env.MONGO_URI;
    // TODO change database name to the name you chose
    const databaseName = "Coved-Tutor-Test";

    try {
        // open mongodb connection
        await mongoose
            .connect(mongoConnectionURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: databaseName,
            });
        
        // insert tutors to db
        const docs = await Tutor.insertMany(tutors);
        console.log("pushed, " +  docs);

    } catch (err) {
        console.log('MongoDB Error: ', err);
    }

    // close the connection
    mongoose.connection.close(); // I don't like putting this here
}