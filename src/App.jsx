
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialItems = [
  {
    id: 1,
    name: "Black Water Bottle",
    type: "Lost",
    category: "Accessories",
    location: "Central Library",
    description: "Black Milton bottle with silver cap.",
    image: "",
    date: "2026-11-10",
  },
  {
    id: 2,
    name: "Blue Notebook",
    type: "Found",
    category: "Stationery",
    location: "CSE Block",
    description: "Blue notebook found near classroom.",
    image: "",
    date: "2026-11-11",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    type: "Found",
    category: "Electronics",
    location: "College Canteen",
    description: "White wireless earbuds in a small case.",
    image: "",
    date: "2026-11-11",
  },
];

function getInitialItems() {
  try {
    const saved = localStorage.getItem("campusconnect-items");
    return saved ? JSON.parse(saved) : initialItems;
  } catch {
    return initialItems;
  }
}

function App() {
  const [items, setItems] = useState(getInitialItems);
  const [name, setName] = useState("");
  const [type, setType] = useState("Lost");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("campusconnect-items", JSON.stringify(items));
  }, [items]);

  const stats = useMemo(() => ({
    total: items.length,
    lost: items.filter(item => item.type === "Lost").length,
    found: items.filter(item => item.type === "Found").length,
    returned: items.filter(item => item.type === "Returned").length,
  }), [items]);

  const filteredItems = items.filter(item => {
    const text = `${item.name} ${item.location} ${item.description} ${item.category}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesType = filter === "All" || item.type === filter;
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  function handleImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please upload an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  function addItem(event) {
    event.preventDefault();

    const newItem = {
      id: Date.now(),
      name: name.trim(),
      type,
      category,
      location: location.trim(),
      description: description.trim(),
      image,
      date: new Date().toISOString().slice(0, 10),
    };

    setItems(previous => [newItem, ...previous]);

    setName("");
    setType("Lost");
    setCategory("Electronics");
    setLocation("");
    setDescription("");
    setImage("");
    setMessage("Your report has been successfully submitted!");

    event.target.reset();
    setTimeout(() => setMessage(""), 4000);
  }

  function findMatches(item) {
    if (item.type === "Returned") return [];

    return items
      .filter(other => {
        if (other.id === item.id || other.type === item.type) {
          return false;
        }

        if (other.type === "Returned") return false;

        const first = `${item.name} ${item.description}`.toLowerCase();
        const second = `${other.name} ${other.description}`.toLowerCase();

        const stopWords = [
          "the", "and", "with", "for", "near", "found",
          "lost", "item", "this", "that", "from", "has",
        ];

        const words = first.match(/[a-z0-9]+/g) || [];

        const common = [...new Set(words)].filter(word =>
          word.length > 2 &&
          !stopWords.includes(word) &&
          second.includes(word)
        );

        const sameCategory = item.category === other.category;
        const sameLocation =
          item.location.toLowerCase().trim() ===
          other.location.toLowerCase().trim();

        const score =
          common.length * 20 +
          (sameCategory ? 25 : 0) +
          (sameLocation ? 30 : 0);

        return score >= 25;
      })
      .map(other => {
        const first = `${item.name} ${item.description}`.toLowerCase();
        const second = `${other.name} ${other.description}`.toLowerCase();
        const words = [...new Set(first.match(/[a-z0-9]+/g) || [])];

        const common = words.filter(word =>
          word.length > 2 && second.includes(word)
        );

        const sameCategory = item.category === other.category;
        const sameLocation =
          item.location.toLowerCase().trim() ===
          other.location.toLowerCase().trim();

        const score = Math.min(
          99,
          common.length * 20 +
          (sameCategory ? 25 : 0) +
          (sameLocation ? 30 : 0)
        );

        return { ...other, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  function markReturned(id) {
    setItems(previous =>
      previous.map(item =>
        item.id === id ? { ...item, type: "Returned" } : item
      )
    );
  }

  function removeItem(id) {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setItems(previous => previous.filter(item => item.id !== id));
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="app">

      {/* NAVIGATION */}
      <nav className="navbar">
        <a className="brand" href="#home">
          Campus<span>Connect</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#report">Report Item</a>
          <a href="#search">Find Items</a>
          <a href="#reports">Recent Reports</a>
        </div>

        <button className="nav-button" onClick={() => scrollTo("report")}>
          Get Started →
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-badge">
          SMART CAMPUS LOST & FOUND PLATFORM
        </div>

        <h1>
          Lost Something?
          <br />
          <span>Find It Here.</span>
        </h1>

        <p>
          A smarter way to reconnect students with their lost belongings.
          Report missing items, discover found belongings and let
          intelligent matching help bring them back to their owners.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={() => scrollTo("report")}>
            Report an Item →
          </button>

          <button className="secondary-btn" onClick={() => scrollTo("search")}>
            Find an Item
          </button>
        </div>

        <div className="hero-bottom">
          <div>
            <strong>Report</strong>
            <span>Lost belongings</span>
          </div>
          <div>
            <strong>Discover</strong>
            <span>Found belongings</span>
          </div>
          <div>
            <strong>Reconnect</strong>
            <span>Smart suggestions</span>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats container">
        <div className="stat-card">
          <span>Total Reports</span>
          <strong>{stats.total}</strong>
          <small>All submitted reports</small>
        </div>

        <div className="stat-card">
          <span>Lost Items</span>
          <strong>{stats.lost}</strong>
          <small>Waiting to be found</small>
        </div>

        <div className="stat-card">
          <span>Found Items</span>
          <strong>{stats.found}</strong>
          <small>Reported on campus</small>
        </div>

        <div className="stat-card">
          <span>Returned Items</span>
          <strong>{stats.returned}</strong>
          <small>Marked as reunited</small>
        </div>
      </section>

      <main className="container">

        {/* REPORT FORM */}
        <section className="section" id="report">
          <div className="section-heading">
            <span className="eyebrow">CONTRIBUTE TO YOUR CAMPUS</span>
            <h2>Report an Item</h2>
            <p>Help someone recover their belongings or report something you found.</p>
          </div>

          <form className="report-form" onSubmit={addItem}>
            <div className="form-grid">

              <div>
                <label>Item Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Example: Black backpack"
                  required
                />
              </div>

              <div>
                <label>Report Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  <option value="Lost">I lost this item</option>
                  <option value="Found">I found this item</option>
                </select>
              </div>

              <div>
                <label>Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>Electronics</option>
                  <option>Stationery</option>
                  <option>Accessories</option>
                  <option>Books</option>
                  <option>ID Cards</option>
                  <option>Clothing</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label>Location *</label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Example: Main Library"
                  required
                />
              </div>

              <div className="full-width">
                <label>Description *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the item's colour, brand, features or other identifying details..."
                  required
                />
              </div>

              <div className="full-width">
                <label>Upload Item Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />

                <small className="helper-text">
                  Optional. JPG, PNG or other image formats. Maximum 5 MB.
                </small>

                {image && (
                  <div className="image-preview">
                    <img src={image} alt="Uploaded item preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => setImage("")}
                    >
                      Remove photo
                    </button>
                  </div>
                )}
              </div>

            </div>

            {message && <p className="success-message">{message}</p>}

            <button type="submit" className="primary-btn submit-btn">
              Submit Report →
            </button>
          </form>
        </section>

        {/* SEARCH */}
        <section className="section" id="search">
          <div className="section-heading">
            <span className="eyebrow">SEARCH CAMPUS REPORTS</span>
            <h2>Find What You're Looking For</h2>
            <p>Search by item name, description, category or campus location.</p>
          </div>

          <div className="search-panel">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for a wallet, phone, notebook, location..."
            />

            <div className="filter-row">
              {["All", "Lost", "Found", "Returned"].map(value => (
                <button
                  key={value}
                  className={filter === value ? "filter-btn active" : "filter-btn"}
                  onClick={() => setFilter(value)}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="category-filter">
              <label>Category</label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="All">All categories</option>
                <option>Electronics</option>
                <option>Stationery</option>
                <option>Accessories</option>
                <option>Books</option>
                <option>ID Cards</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* REPORT CARDS */}
        <section className="section" id="reports">
          <div className="section-heading">
            <span className="eyebrow">CAMPUS COMMUNITY</span>
            <h2>Recent Reports</h2>
            <p>Browse recently reported lost and found belongings.</p>
          </div>

          <div className="items-grid">
            {filteredItems.map(item => {
              const matches = findMatches(item);

              return (
                <article className="item-card" key={item.id}>

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>{item.category}</span>
                    </div>
                  )}

                  <div className="item-content">

                    <div className="item-top">
                      <span className={`status ${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                      <span className="item-date">{item.date}</span>
                    </div>

                    <h3>{item.name}</h3>

                    <p className="item-description">
                      {item.description}
                    </p>

                    <div className="item-location">
                      <span>⌖</span> {item.location}
                    </div>

                    <div className="item-category">
                      {item.category}
                    </div>

                    {matches.length > 0 && (
                      <div className="match-box">
                        <strong>Possible Match Found</strong>

                        {matches.slice(0, 2).map(match => (
                          <div className="match-result" key={match.id}>
                            <span>{match.name}</span>
                            <span>{match.matchScore}%</span>
                          </div>
                        ))}

                        <small>
                          Preliminary keyword, category and location score.
                        </small>
                      </div>
                    )}

                    {item.type === "Returned" && (
                      <p className="returned-message">
                        This item has been marked as returned.
                      </p>
                    )}

                    <div className="card-actions">
                      {item.type !== "Returned" && (
                        <button
                          className="return-btn"
                          onClick={() => markReturned(item.id)}
                        >
                          Mark Returned
                        </button>
                      )}

                      <button
                        className="delete-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="empty-state">
                <h3>No matching reports found</h3>
                <p>Try another search term or change your filters.</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <h2>CampusConnect</h2>
        <p>Helping students reconnect with what matters.</p>
        <span>© 2026 CampusConnect. Built for a smarter campus.</span>
      </footer>

    </div>
  );
}

export default App;
