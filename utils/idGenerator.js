// Code to generate unique Ids for doctors, patients and admins

const IdGenerator = require("../models/idGeneratorModel");

const generateDoctorId = async () => {
    const id = await IdGenerator.getNextId("doctorIdCounter");
    return `DOC-${id}`;
};

const generatePatientId = async () => {
    const id = await IdGenerator.getNextId("patientIdCounter");
    return `PAT-${id}`;
};

const generateAdminId = async () => {
    const id = await IdGenerator.getNextId("adminIdCounter");
    return `ADM-${id}`;
};

module.exports = { generateDoctorId, generatePatientId, generateAdminId };
