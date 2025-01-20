const AccountDeletionRequest = require('../../models/accountDeletionModel');

const getAccountDeletionRequests = async (req, res) => {
    try {
        // Assuming you have a model named AccountDeletionRequest
        const requests = await AccountDeletionRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching account deletion requests', error });
    }
};

module.exports = {
    getAccountDeletionRequests
};