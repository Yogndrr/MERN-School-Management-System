const supabase = require('../supabase');

const issueBook = async (req, res) => {
    try {
        const { studentId, bookTitle, borrowDate, dueDate, schoolId, classId } = req.body;

        const { data, error } = await supabase
            .from('library_transactions')
            .insert([{
                student_id: studentId,
                book_title: bookTitle,
                borrow_date: borrowDate,
                due_date: dueDate,
                school_id: schoolId,
                sclass_id: classId,
                issued_by: req.user?.id,
                status: 'borrowed'
            }])
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error issuing book' });
    }
};

const returnBook = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { returnDate, conditionReturned, fineAmount } = req.body;

        const { data, error } = await supabase
            .from('library_transactions')
            .update({
                return_date: returnDate,
                condition_returned: conditionReturned,
                fine_amount: fineAmount,
                status: 'returned'
            })
            .eq('id', recordId)
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error returning book' });
    }
};

const getStudentLibraryHistory = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('library_transactions')
            .select('*')
            .eq('student_id', req.params.studentId)
            .order('borrow_date', { ascending: false });

        if (error) return res.status(400).json(error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching library history' });
    }
};

const getCurrentBorrowedBooks = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getOverdueBooks = async (req, res) => res.status(501).json({ message: "Not implemented" });
const payFine = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getLibraryAnalytics = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
    issueBook,
    returnBook,
    getStudentLibraryHistory,
    getCurrentBorrowedBooks,
    getOverdueBooks,
    payFine,
    getLibraryAnalytics
};
