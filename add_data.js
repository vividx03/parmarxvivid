const fs = require('fs');
const readline = require('readline-sync');

// Database load karte waqt notifications check karna zaroori hai
function loadDB() { 
    if (!fs.existsSync('db.json')) fs.writeFileSync('db.json', JSON.stringify({ courses: [], notifications: [] }));
    let db = JSON.parse(fs.readFileSync('db.json', 'utf8')); 
    if (!db.notifications) db.notifications = [];
    return db;
}
function saveDB(db) { fs.writeFileSync('db.json', JSON.stringify(db, null, 2)); }

function main() {
    let db = loadDB();
    // AAPKA NAYA MENU
    const options = ['Add/Update Content', 'Manage/Delete Content', '📢 Add Notification', '🗑️ Delete Notification', 'EXIT'];
    const index = readline.keyInSelect(options, 'VIVID ACADEMY DASHBOARD');
    
    if (index === 0) addNewOrUpdate(db);
    else if (index === 1) manageData(db);
    else if (index === 2) addNotification(db); // Naya Function
    else if (index === 3) deleteNotification(db); // Naya Function
    else process.exit();
}

// --- NOTIFICATION ADD KARNE KA KAAM ---
function addNotification(db) {
    console.log('\n--- 📢 NEW NOTIFICATION ---');
    let msg = readline.question('Enter Message: ');
    let tag = readline.question('Tag (NEW/UPDATE/ALERT): ').toUpperCase() || "UPDATE";
    let date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    db.notifications.push({ tag, message: msg, date });
    saveDB(db);
    console.log('✅ Notification Published!');
    main();
}

// --- NOTIFICATION DELETE KARNE KA KAAM ---
function deleteNotification(db) {
    if (db.notifications.length === 0) {
        console.log("❌ No notifications found.");
        return main();
    }
    let list = db.notifications.map(n => `[${n.tag}] ${n.message.slice(0, 30)}...`);
    let idx = readline.keyInSelect(list, 'Delete which notification?');
    
    if (idx !== -1) {
        if (readline.keyInYN('Confirm Delete?')) {
            db.notifications.splice(idx, 1);
            saveDB(db);
            console.log('🗑️ Deleted!');
        }
    }
    main();
}

function addNewOrUpdate(db) {
    let courseNames = db.courses.map(c => c.name);
    courseNames.push("ADD ANOTHER COURSE (+)");
    let cIndex = readline.keyInSelect(courseNames, 'Select Course:');
    if (cIndex === -1) return main();

    if (cIndex === courseNames.length - 1) {
        let newCourseName = readline.question('Enter New Course Name: ').toUpperCase();
        let teacherName = readline.question('Enter Teacher Name: ').toUpperCase();
        
        const modeOptions = ['Regular Course', 'Direct Link'];
        let modeIndex = readline.keyInSelect(modeOptions, 'Select Mode:');
        
        if (modeIndex === 1) {
            let directLink = readline.question('Enter Redirect Link: ');
            db.courses.push({ name: newCourseName, teacher: teacherName, directLink: directLink, subjects: [] });
            saveDB(db);
            console.log('✅ Redirect Course Added!');
        } else {
            db.courses.push({ name: newCourseName, teacher: teacherName, subjects: [] });
            saveDB(db);
            console.log('✅ Regular Course Added!');
        }
        return main();
    }

    let course = db.courses[cIndex];
    let subjectNames = course.subjects.map(s => s.name);
    subjectNames.push("ADD NEW SUBJECT (+)");
    let sIndex = readline.keyInSelect(subjectNames, 'Select Subject:');
    if (sIndex === -1) return main();

    if (sIndex === subjectNames.length - 1) {
        let newSubName = readline.question('Enter New Subject Name: ').toUpperCase();
        course.subjects.push({ name: newSubName, CHAPTERS: [], "WEEKLY TESTS": [] });
        saveDB(db);
        return main();
    }

    let sub = course.subjects[sIndex];
    const types = ['CHAPTERS', 'WEEKLY TESTS'];
    let tIndex = readline.keyInSelect(types, 'Select Category:');
    if (tIndex === -1) return main();
    let cat = types[tIndex];

    let list = sub[cat].map(item => item.title);
    list.push("ADD NEW " + cat);
    let itemIndex = readline.keyInSelect(list, 'Select Item:');
    if (itemIndex === -1) return main();

    let title, existing = null;
    if (itemIndex === list.length - 1) title = readline.question('Enter Title: ');
    else { existing = sub[cat][itemIndex]; title = existing.title; }

    console.log("\n[LECTURE LINK / HTML CODE] - Type 'DONE' to finish");
    let lines = [];
    while (true) {
        let line = readline.question('>');
        if (line.trim().toUpperCase() === 'DONE') break;
        lines.push(line);
    }
    let link = lines.join(" ").trim();
    if (!link && existing) link = existing.url;

    let dLink = (link && link.includes('<')) ? readline.question('Download Link: ') : (existing ? existing.download_url : null);
    let nEn = readline.question('Eng Notes: ', {defaultInput: existing ? existing.notes_en : ''});
    let nHi = readline.question('Hindi Notes: ', {defaultInput: existing ? existing.notes_hi : ''});
    let quiz = readline.question('Quiz: ', {defaultInput: existing ? existing.quiz : ''});
    let ppt = readline.question('PPT/Other: ', {defaultInput: existing ? existing.handwritten : ''});

    let newData = { title, url: link || null, download_url: dLink || null, notes_en: nEn || null, notes_hi: nHi || null, quiz: quiz || null, handwritten: ppt || null };
    if (existing) sub[cat][itemIndex] = newData; else sub[cat].push(newData);
    saveDB(db);
    console.log('\n✅ Saved!');
    main();
}

function manageData(db) {
    let list = db.courses.map(c => c.name);
    let cIndex = readline.keyInSelect(list, 'Manage which course?');
    if (cIndex === -1) return main();

    if (readline.keyInYN('Delete FULL Course?')) {
        db.courses.splice(cIndex, 1);
        saveDB(db);
        console.log('🗑️ Deleted!');
    }
    main();
}

main();
