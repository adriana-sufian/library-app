import { useState, useEffect } from "react";

export default function BookForm({ onSubmit, book, onCancel }) {
  const [form, setForm] = useState({
    title: "", 
    author: "", 
    isbn: "", 
    year: "", 
    genre: "", 
    copies: 1, 
    available: true
  });

  // updates the form when book prop changes
  useEffect(() => {
    if (book) {
      setForm(book);
    } else {
      // Clear form when no book is being edited (for new books)
      setForm({
        title: "", 
        author: "", 
        isbn: "", 
        year: "", 
        genre: "", 
        copies: 1, 
        available: true
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
      <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
      <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} required />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
      <input name="copies" type="number" min="1" value={form.copies} onChange={handleChange} required />
      <label>
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Available
      </label>
      <div >
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {book ? 'Update' : 'Add Book'}
        </button>
        {book && (
          <button 
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}