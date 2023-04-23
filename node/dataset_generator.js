const draw = require('../common/draw.js');
const { createCanvas } = require('canvas')
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

const constants = {};

constants.DATA_DIR = '../data';
constants.RAW_DIR = `${constants.DATA_DIR}/raw`;
constants.DATASET_DIR = `${constants.DATA_DIR}/dataset`;
constants.JSON_DIR = `${constants.DATASET_DIR}/json`;
constants.IMG_DIR = `${constants.DATASET_DIR}/img`;
constants.SAMPLES = `${constants.DATASET_DIR}/samples.json`;

const fs = require('fs');

const filenames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
filenames.forEach(fn => {
    const content = fs.readFileSync(`${constants.RAW_DIR}/${fn}`, 'utf8');
    const { session, student, drawings } = JSON.parse(content);
    for (let label in drawings) {
        samples.push({
            id,
            label,
            student_name: student,
            student_id: session
        });

        const paths = drawings[label];
        fs.writeFileSync(`${constants.JSON_DIR}/${id}.json`, JSON.stringify(paths, null, 2));

        generateImageFile(`${constants.IMG_DIR}/${id}.png`, paths)

        id++;
    }
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples, null, 2));

function generateImageFile(filename, paths) {
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
}
