const fs = require('fs');
const readline = require('readline-sync');

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

console.log("\n--- Admin Panel: Add Content ---");

// 1. Course Selection
let courseNames = db.courses.map(c => c.name);
let cIndex = readline.keyInSelect(courseNames, 'Select Course:');
let cName = (cIndex === -1) ? readline.question('Enter New Course Name: ') : courseNames[cIndex];

let course = db.courses.find(c => c.name === cName);
if (!course) {
    course = { name: cName, subjects: [] };
    db.courses.push(course);
}

// 2. Subject Selection
let subjectNames = course.subjects.map(s => s.name);
let sIndex = readline.keyInSelect(subjectNames, 'Select Subject:');
let sName = (sIndex === -1) ? readline.question('Enter New Subject Name: ') : subjectNames[sIndex];

let sub = course.subjects.find(s => s.name === sName);
if (!sub) {
    sub = { name: sName, chapters: [] };
    course.subjects.push(sub);
}

// 3. New Content Details
let chName = readline.question('Chapter/Lecture Title: ');
let link = readline.question('Lecture Link (YouTube/Drive): ');
let notesEn = readline.question('English Notes Link (Skip if none): ');
let notesHi = readline.question('Hindi Notes Link (Skip if none): ');
let quizLink = readline.question('Quiz Link (Skip if none): ');
let handwritten = readline.question('Handwritten Notes Link (Skip if none): ');

sub.chapters.push({
    title: chName,
    url: link,
    notes_en: notesEn || null,
    notes_hi: notesHi || null,
    quiz: quizLink || null,
    handwritten: handwritten || null
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('\n✅ Data added successfully!');
