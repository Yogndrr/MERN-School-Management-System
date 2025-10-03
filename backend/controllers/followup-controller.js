const FollowUp = require('../models/followupSchema.js');

const followUpCreate = async (req, res) => {
  try {
    const { adminID, ...rest } = req.body;
    const followUp = new FollowUp({ ...rest, school: adminID });
    const result = await followUp.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const followUpList = async (req, res) => {
  try {
    const { id } = req.params; // admin id
    const { upcoming } = req.query; // optional filter

    let query = { school: id };

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    let followups = await FollowUp.find(query)
      .populate('assignedTo', 'name')
      .sort({ date: 1, createdAt: -1 });

    if (followups.length > 0) {
      res.send(followups);
    } else {
      res.send({ message: 'No follow-ups found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const followUpDetail = async (req, res) => {
  try {
    let followup = await FollowUp.findById(req.params.id).populate('assignedTo', 'name');
    if (followup) {
      res.send(followup);
    } else {
      res.send({ message: 'No follow-up found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const followUpUpdate = async (req, res) => {
  try {
    const result = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('assignedTo', 'name');
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const followUpDelete = async (req, res) => {
  try {
    const result = await FollowUp.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const followUpDeleteMany = async (req, res) => {
  try {
    const result = await FollowUp.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: 'No follow-ups found to delete' });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { followUpCreate, followUpList, followUpDetail, followUpUpdate, followUpDelete, followUpDeleteMany };
