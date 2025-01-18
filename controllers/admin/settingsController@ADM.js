const Settings = require('../../models/settingsModel');

// Create platform settings
const createSettings = async (req, res) => {
    const { key, value, description } = req.body;

    try {
        const setting = new Settings({ key, value, description });
        await setting.save();
        res.status(201).json({ message: 'Settings created successfully', setting });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete platform settings
const deleteSettings = async (req, res) => {
    const { key } = req.body;

    try {
        const setting = await Settings.findOneAndDelete({ key });
        if (!setting) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.status(200).json({ message: 'Settings deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update platform configurations
const updateSettings = async (req, res) => {
    const { key, value, description } = req.body;

    try {
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value, description },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Settings updated successfully', setting });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View platform settings
const viewSettings = async (req, res) => {
    try {
        const settings = await Settings.find();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSettings,
    deleteSettings,
    updateSettings,
    viewSettings
};
