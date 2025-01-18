const Notification = require('../../models/notificationModel');

// Send notifications to doctors or patients
const sendNotifications = async (req, res) => {
    const { recipient, recipientType, title, message, link, type } = req.body;

    try {
        const notification = new Notification({
            recipient,
            recipientType,
            title,
            message,
            link,
            type
        });

        await notification.save();
        res.status(201).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendNotifications
};
