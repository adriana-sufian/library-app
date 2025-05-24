export const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
export const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));

export const getAvailableBooks = () =>
  (JSON.parse(localStorage.getItem("books")) || []).filter(b => b.available);