// src/components/SearchBar.tsx
import { FormEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";

type Props = {
  onSearch?: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
  };

  return (
    <section
      className="hero"
    >
      <h1>Discover Movies</h1>
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

      <form className="search" onSubmit={handleSubmit}>
        <div className="input-wrap">
          <FiSearch />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
          />
        </div>
        <button type="submit">Search</button>
      </form>
    </section>
  );
}
