const fs = require('fs');
const readline = require('readline-sync');

function loadDB() {
    return JSON.parse(fs.readFileSync('db.json', 'utf8'));
}

function saveDB(db) {
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
}

function main() {
    let db = loadDB();
    const options = ['Add New Content', 'Manage/Delete Data'];
    const index = readline.keyInSelect(options, 'What do you want to do?');

    if (index === 0) {
        addNew(db);
    } else if (index === 1) {
        manageData(db);
    }
}

function addNew(db) {
    console.log("\n--- Add New Content ---");
    let courseNames = db.courses.map(c => c.name);
    let cIndex = readline.keyInSelect(courseNames, 'Select Course:');
    let cName = (cIndex === -1) ? readline.question('Enter New Course Name: ') : courseNames[cIndex];

    let course = db.courses.find(c => c.name === cName);
    if (!course) { course = { name: cName, subjects: [] }; db.courses.push(course); }

    let subjectNames = course.subjects.map(s => s.name);
    let sIndex = readline.keyInSelect(subjectNames, 'Select Subject:');
    let sName = (sIndex === -1) ? readline.question('Enter New Subject Name: ') : subjectNames[sIndex];

    let sub = course.subjects.find(s => s.name === sName);
    if (!sub) { sub = { name: sName, chapters: [] }; course.subjects.push(sub); }

    let chName = readline.question('Chapter Title: ');
    let link = readline.question('Lecture Link: ');
    let notesEn = readline.question('Eng Notes (Optional): ');
    let notesHi = readline.question('Hindi Notes (Optional): ');
    let quiz = readline.question('Quiz (Optional): ');
    let hand = readline.question('Handwritten (Optional): ');

    sub.chapters.push({ title: chName, url: link, notes_en: notesEn || null, notes_hi: notesHi || null, quiz: quiz || null, handwritten: hand || null });
    saveDB(db);
    console.log('✅ Added!');
}

function manageData(db) {
    console.log("\n--- Manage/Delete Data ---");
    let cNames = db.courses.map(c => c.name);
    let ci = readline.keyInSelect(cNames, 'Select Course to Manage:');
    if (ci === -1) return;

    let sNames = db.courses[ci].subjects.map(s => s.name);
    let si = readline.keyInSelect(sNames, 'Select Subject:');
    if (si === -1) return;

    let chNames = db.courses[ci].subjects[si].chapters.map(ch => ch.title);
    let chi = readline.keyInSelect(chNames, 'Select Chapter to DELETE:');
    
    if (chi !== -1) {
        if (readline.keyInYN(`Are you sure you want to delete "${chNames[chi]}"?`)) {
            db.courses[ci].subjects[si].chapters.splice(chi, 1);
            saveDB(db);
            console.log('🗑️ Deleted successfully!');
        }
    }
}

main();
