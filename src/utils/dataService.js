import { getLoans } from "./loanService";
export const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
export const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));

export const getAvailableBooks = () => {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  return books.filter(book => {
    const onHold = book.onHoldCopies || 0;
    const available = (book.totalCopies || 0) - onHold;
    return available > 0;
  });
};

export const recalculateBookHoldCounts = () => {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const loans = getLoans();
  const requests = JSON.parse(localStorage.getItem("borrowRequests")) || [];

  const holdMap = {};

  loans.forEach(l => {
    if (l.status === "Active") {
      holdMap[l.bookId] = (holdMap[l.bookId] || 0) + 1;
    }
  });

  requests.forEach(r => {
    r.bookIds.forEach(id => {
      holdMap[id] = (holdMap[id] || 0) + 1;
    });
  });

  const updatedBooks = books.map(b => ({
    ...b,
    onHoldCopies: holdMap[b.id] || 0,
  }));

  localStorage.setItem("books", JSON.stringify(updatedBooks));
  return updatedBooks;
};