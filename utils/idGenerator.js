const fs = require('fs');
const path = require('path');

// File path for storing counters
const COUNTERS_FILE = path.resolve(__dirname, 'counters.json');

// Load or initialize counters
let countersForIds = {
    doctorIdCounter: 0,
    patientIdCounter: 3, // Start from 3 to avoid conflicts with sample data
    adminIdCounter: 3 // Start from 3 to avoid conflicts with sample data
};

if (fs.existsSync(COUNTERS_FILE)) {
    countersForIds = JSON.parse(fs.readFileSync(COUNTERS_FILE, 'utf8'));
}

// Save counters to file
function saveCounters() {
    fs.writeFileSync(COUNTERS_FILE, JSON.stringify(countersForIds, null, 2));
}

// General function to generate an ID
function generateId(prefix, counterKey) {
    countersForIds[counterKey] += 1;
    saveCounters();
    return `${prefix}-${countersForIds[counterKey].toString().padStart(4, '0')}`;
}

// Specific generators
function generateDoctorId() {
    return generateId('DOC', 'doctorIdCounter');
}

function generatePatientId() {
    return generateId('PAT', 'patientIdCounter');
}

function generateAdminId() {
    return generateId('ADM', 'adminIdCounter');
}

module.exports = {
    generateDoctorId,
    generatePatientId,
    generateAdminId
};
