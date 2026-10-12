/* The offline bundle is derived from the two editable JSON sources. */
const fs=require('node:fs');
const cards=JSON.parse(fs.readFileSync('data/cards.json','utf8'));
const seminar=JSON.parse(fs.readFileSync('data/seminar.json','utf8'));
fs.writeFileSync('data/bundle.js','window.GD_DATA='+JSON.stringify({...cards,exercises:seminar.exercises})+';\n');
