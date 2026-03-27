const Paper = require('../models/paperSchema.js');

const createPaper = async (req, res) => {
    try {
        const { title, content, sclassName, subject, teacher, school, status } = req.body;
        const newPaper = new Paper({
            title,
            content,
            sclassName,
            subject,
            teacher,
            school,
            status: status || "Pending"
        });
        const result = await newPaper.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTeacherPapers = async (req, res) => {
    try {
        const papers = await Paper.find({ teacher: req.params.teacherId }).populate('sclassName subject');
        res.status(200).json(papers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSchoolPapers = async (req, res) => {
    try {
        const papers = await Paper.find({ school: req.params.schoolId }).populate('teacher sclassName subject');
        res.status(200).json(papers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updatePaperStatus = async (req, res) => {
    try {
        const result = await Paper.findByIdAndUpdate(
            req.params.paperId,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updatePaperContent = async (req, res) => {
    try {
        const result = await Paper.findByIdAndUpdate(
            req.params.paperId,
            { content: req.body.content, title: req.body.title },
            { new: true }
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deletePaper = async (req, res) => {
    try {
        const result = await Paper.findByIdAndDelete(req.params.paperId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPaper,
    getTeacherPapers,
    getSchoolPapers,
    updatePaperStatus,
    updatePaperContent,
    deletePaper
};
