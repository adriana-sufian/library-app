import { useState, useEffect } from "react";
import { getBooks, saveBooks } from "../utils/dataService";
import { getLoans, saveLoans } from "../utils/loanService";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import LoanForm from "../components/LoanForm";
import LoanList from "../components/LoanList";
import { v4 as uuidv4 } from "uuid";

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const [loans, setLoans] = useState([]);
  const [editingLoan, setEditingLoan] = useState(null);

  useEffect(() => {
    setBooks(getBooks());
    setLoans(getLoans());
  }, []);

  const handleSave = (book) => {
    let updated;
    if (book.id) {
      updated = books.map(b => (b.id === book.id ? book : b));
    } else {
      book.id = uuidv4();
      updated = [...books, book];
    }
    setBooks(updated);
    saveBooks(updated);
    setEditingBook(null);
  };

  const handleEdit = (book) => setEditingBook(book);
  const handleDelete = (id) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    saveBooks(updated);
  };

  const handleSaveLoan = (loan) => {
    let updated;
    if (loan.id) {
      updated = loans.map(l => l.id === loan.id ? loan : l);
    } else {
      loan.id = uuidv4();
      updated = [...loans, loan];
    }
    setLoans(updated);
    saveLoans(updated);
    setEditingLoan(null);
  };

  const handleDeleteLoan = (id) => {
    const updated = loans.filter(l => l.id !== id);
    setLoans(updated);
    saveLoans(updated);
  };

  // for librarians to see borrow requests
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setBooks(getBooks());
    setLoans(getLoans());
    const existingRequests = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    setRequests(existingRequests);
  }, []);

  // return loans
  const handleReturnLoan = (loan) => {
    // Update loan status
    const updatedLoans = loans.map(l =>
      l.id === loan.id ? { ...l, status: "Returned" } : l
    );
    setLoans(updatedLoans);
    saveLoans(updatedLoans);

    // Update book copies
    const updatedBooks = books.map(b => {
      if (b.id === loan.bookId) {
        const newCopies = b.copies + 1;
        return {
          ...b,
          copies: newCopies,
          available: true,
        };
      }
      return b;
    });

  setBooks(updatedBooks);
  saveBooks(updatedBooks);
};

return (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Library Book Management</h1>
    <BookForm onSubmit={handleSave} book={editingBook} />
    <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />
    <h2 className="text-xl font-semibold mt-8 mb-2">Loan Management</h2>
    <LoanForm onSubmit={handleSaveLoan} books={books} loan={editingLoan} />
    <LoanList loans={loans} books={books} onEdit={setEditingLoan} onDelete={handleDeleteLoan} onReturn={handleReturnLoan} />
    <h2 className="text-xl font-semibold mt-8 mb-2">Borrow Requests</h2>
    {requests.map((req) => (
      <div key={req.id} className="border p-4 rounded mb-2 bg-yellow-50">
        <p><strong>Member:</strong> {req.memberName}</p>
        <p><strong>Date:</strong> {req.requestDate}</p>
        <p><strong>Books:</strong></p>
        <ul className="list-disc list-inside ml-4">
          {req.bookIds.map(id => {
            const book = books.find(b => b.id === id);
            return <li key={id}>{book ? book.title : "(Unknown Book)"}</li>;
          })}
        </ul>
      </div>
    ))}
  </div>
);}
