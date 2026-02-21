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
    const options = ['Add/Update Content', 'Manage/Delete Data'];
    const index = readline.keyInSelect(options, 'What do you want to do?');

    if (index === 0) {
        addNewOrUpdate(db);
    } else if (index === 1) {
        manageData(db);
    }
}

function addNewOrUpdate(db) {
    console.log("\n--- Add or Update Content ---");
    let courseNames = db.courses.map(c => c.name);
    let cIndex = readline.keyInSelect(courseNames, 'Select Course:');
    if (cIndex === -1) return;
    let cName = courseNames[cIndex];

    let course = db.courses.find(c => c.name === cName);

    let subjectNames = course.subjects.map(s => s.name);
    let sIndex = readline.keyInSelect(subjectNames, 'Select Subject:');
    if (sIndex === -1) return;
    let sName = subjectNames[sIndex];

    let sub = course.subjects.find(s => s.name === sName);

    // --- STEP 1: SIRF CHAPTER NAMES KI LIST ---
    let chapterOptions = sub.chapters.map(ch => ch.title);
    chapterOptions.push("ADD NEW CHAPTER"); 
    
    console.log("\n--- Select Chapter ---");
    let chIndex = readline.keyInSelect(chapterOptions, 'Choose Chapter:');

    if (chIndex === -1) return;

    let chName, existingChapter = null;

    if (chIndex === chapterOptions.length - 1) {
        // Naya Chapter
        chName = readline.question('Enter New Chapter Title: ');
    } else {
        // Purana Chapter select kiya
        existingChapter = sub.chapters[chIndex];
        chName = existingChapter.title;
        console.log("\nSelected: " + chName);
    }

    // --- STEP 2: AB DETAILS PUCHEGA ---
    console.log("\n--- Enter Details for: " + chName + " ---");
    let link = readline.question('Lecture Link: ', {defaultInput: existingChapter ? existingChapter.url : ''});
    let notesEn = readline.question('English Notes Link: ', {defaultInput: existingChapter ? existingChapter.notes_en : ''});
    let notesHi = readline.question('Hindi Notes Link: ', {defaultInput: existingChapter ? existingChapter.notes_hi : ''});
    let quiz = readline.question('Quiz Link: ', {defaultInput: existingChapter ? existingChapter.quiz : ''});
    let ppt = readline.question('PPT/Handwritten Link: ', {defaultInput: existingChapter ? existingChapter.handwritten : ''});

    let newChapterData = { 
        title: chName, 
        url: link, 
        notes_en: notesEn || null, 
        notes_hi: notesHi || null, 
        quiz: quiz || null, 
        handwritten: ppt || null 
    };

    if (existingChapter) {
        sub.chapters[chIndex] = newChapterData;
    } else {
        sub.chapters.push(newChapterData);
    }
    
    saveDB(db);
    console.log('\n✅ Chapter Details Updated Successfully!');
}

function manageData(db) {
    console.log("\n--- Manage/Delete Data ---");
    let cNames = db.courses.map(c => c.name);
    let ci = readline.keyInSelect(cNames, 'Select Course:');
    if (ci === -1) return;

    let sNames = db.courses[ci].subjects.map(s => s.name);
    let si = readline.keyInSelect(sNames, 'Select Subject:');
    if (si === -1) return;

    let chNames = db.courses[ci].subjects[si].chapters.map(ch => ch.title);
    let chi = readline.keyInSelect(chNames, 'Select Chapter to DELETE:');
    
    if (chi !== -1) {
        if (readline.keyInYN('Are you sure you want to delete "' + chNames[chi] + '"?')) {
            db.courses[ci].subjects[si].chapters.splice(chi, 1);
            saveDB(db);
            console.log('🗑️ Deleted successfully!');
        }
    }
}

main();
