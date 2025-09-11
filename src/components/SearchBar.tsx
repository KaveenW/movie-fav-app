import { FormEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";

type Props = {
  onSearch?: (query: string) => void; // Optional callback for parent component
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState(""); // Track search input

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return; // Ignore empty queries
    onSearch?.(query.trim()); // Trigger parent callback
  };

  return (
    <section className="hero">
      {/* Hero title */}
      <h1>Discover Movies</h1>

      {/* Hero description */}
      <p
        style={{
          maxWidth: "600px",
          margin: "10px auto 28px",
          color: "#9aa2af",
          fontSize: "1.25rem",
          textAlign: "center",
        }}
      >
        Search through millions of movies, explore details, and build your
        personal favorites collection
      </p>

      {/* Search form */}
      <form className="search" onSubmit={handleSubmit}>
        <div className="input-wrap">
          <FiSearch /> {/* Search icon */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update input state
            placeholder="Search for movies..."
          />
        </div>
        <button type="submit">Search</button> {/* Submit button */}
      </form>
    </section>
  );
}
