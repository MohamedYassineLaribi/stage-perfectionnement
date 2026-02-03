const Lead = require('../models/Lead');

const getLeads = async (req, res) => {
    try {
        let query = {};
        if (req.user.role.name !== 'Admin' && req.user.role !== 'Admin') {
            query.salesPerson = req.user._id;
        }
        const leads = await Lead.find(query).populate('salesPerson', 'name');
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLead = async (req, res) => {
    try {
        const lead = new Lead({
            ...req.body,
            salesPerson: req.body.salesPerson || req.user._id
        });
        const savedLead = await lead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (lead) {
            Object.assign(lead, req.body);
            const updatedLead = await lead.save();
            res.json(updatedLead);
        } else {
            res.status(404).json({ message: 'Lead non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (lead) {
            await lead.deleteOne();
            res.json({ message: 'Lead supprimé' });
        } else {
            res.status(404).json({ message: 'Lead non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLeads, createLead, updateLead, deleteLead };
