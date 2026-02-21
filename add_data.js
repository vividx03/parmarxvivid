const fs = require('fs');
const readline = require('readline-sync');

if (!fs.existsSync('db.json')) {
    fs.writeFileSync('db.json', JSON.stringify({ courses: [] }));
}

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

console.log("\n--- Admin Panel: Add New Content ---");
let cName = readline.question('Course Name (e.g., SSC): ');
let sName = readline.question('Subject Name (e.g., Geography): ');
let chName = readline.question('Chapter Name: ');
let link = readline.question('Lecture Link: ');
let notesEn = readline.question('English Notes Link: ');
let notesHi = readline.question('Hindi Notes Link: ');

let course = db.courses.find(c => c.name === cName);
if(!course) { 
    course = {name: cName, subjects: []}; 
    db.courses.push(course); 
}

let sub = course.subjects.find(s => s.name === sName);
if(!sub) { 
    sub = {name: sName, chapters: []}; 
    course.subjects.push(sub); 
}

sub.chapters.push({
    title: chName, 
    url: link, 
    notes_en: notesEn, 
    notes_hi: notesHi
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('\n✅ Data added locally in db.json!');
