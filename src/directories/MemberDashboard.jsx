import { useState, useEffect } from "react";
import { getAvailableBooks } from "../utils/dataService";
import { v4 as uuidv4 } from "uuid";
import AvailableBookList from "../components/AvailableBookList";

export default function MemberDashboard() {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setBooks(getAvailableBooks());
  }, []);

  const handleToggleBook = (bookId) => {
    setSelectedBooks(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSubmit = () => {
    if (!memberName.trim()) return alert("Please enter your name.");
    if (selectedBooks.length === 0) return alert("Select at least 1 book.");
    if (selectedBooks.length > 5) return alert("You can only borrow up to 5 books.");

    const booksFromStorage = JSON.parse(localStorage.getItem("books")) || [];

    const request = {
      id: uuidv4(),
      memberName,
      bookIds: selectedBooks,
      requestDate: new Date().toISOString().split("T")[0],
    };

    const existing = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    
    // doesnt let users borrow unavailable books
    const unavailableBooks = selectedBooks.filter(bookId => {
    const book = booksFromStorage.find(b => b.id === bookId);
        return !book || book.copies <= 0;
        });

        if (unavailableBooks.length > 0) {
        return alert("One or more selected books are no longer available.");
        }
    localStorage.setItem("borrowRequests", JSON.stringify([...existing, request]));

    // reduce number of copies after borrow request submitted
    selectedBooks.forEach(bookId => {
    const book = booksFromStorage.find(b => b.id === bookId);
    if (book && book.copies > 0) {
        book.copies -= 1;
        if (book.copies === 0) {
        book.available = false;
        }
    }
    });

    localStorage.setItem("books", JSON.stringify(booksFromStorage));

    // Clear form
    setSelectedBooks([]);
    setMemberName("");
    setSuccessMessage("Borrow request submitted successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse & Borrow Books</h1>
      
      <input
        type="text"
        placeholder="Your Name"
        className="border p-2 w-full mb-4"
        value={memberName}
        onChange={e => setMemberName(e.target.value)}
      />

      <AvailableBookList
        books={books}
        selectedBooks={selectedBooks}
        onToggleBook={handleToggleBook}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Borrow Request
      </button>

      {successMessage && (
        <p className="text-green-600 mt-4">{successMessage}</p>
      )}
    </div>
  );
}
