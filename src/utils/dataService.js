export const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
export const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));