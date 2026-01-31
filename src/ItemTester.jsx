import { useEffect, useState } from "react";

export default function ItemTester() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // POST form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  // PATCH form
  const [patchPrice, setPatchPrice] = useState("");

  // PUT form
  const [putName, setPutName] = useState("");
  const [putCategory, setPutCategory] = useState("");
  const [putPrice, setPutPrice] = useState("");

  const API_BASE = "http://localhost:3000/api/item";

  /* -------------------------
     GET ALL ITEMS
  -------------------------- */
  async function fetchItems() {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setItems(data);

    if (data.length > 0) {
      setSelectedId(data[0]._id);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  /* -------------------------
     POST CREATE ITEM
  -------------------------- */
  async function handleCreate(e) {
    e.preventDefault();

    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        price,
      }),
    });

    alert("Item Created!");
    fetchItems();
  }

  /* -------------------------
     GET ITEM DETAIL
  -------------------------- */
  async function handleGetDetail() {
    const res = await fetch(`${API_BASE}/${selectedId}`);
    const data = await res.json();

    alert("Item Detail:\n" + JSON.stringify(data, null, 2));
  }

  /* -------------------------
     PATCH UPDATE PRICE
  -------------------------- */
  async function handlePatch() {
    await fetch(`${API_BASE}/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: patchPrice,
      }),
    });

    alert("PATCH Updated!");
    fetchItems();
  }

  /* -------------------------
     PUT REPLACE ITEM
  -------------------------- */
  async function handlePut() {
    await fetch(`${API_BASE}/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: putName,
        itemCategory: putCategory,
        itemPrice: putPrice,
      }),
    });

    alert("PUT Replaced!");
    fetchItems();
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Item API Tester</h1>

      {/* GET ALL */}
      <h2>All Items</h2>
      <button onClick={fetchItems}>Refresh</button>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.itemName} | {item.itemCategory} | ${item.itemPrice}
          </li>
        ))}
      </ul>

      {/* SELECT ITEM */}
      <h2>Select Item ID</h2>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {items.map((item) => (
          <option key={item._id} value={item._id}>
            {item.itemName}
          </option>
        ))}
      </select>

      <button onClick={handleGetDetail} style={{ marginLeft: 10 }}>
        GET Detail
      </button>

      <hr />

      {/* POST */}
      <h2>POST Create Item</h2>
      <form onSubmit={handleCreate}>
        <input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>

      <hr />

      {/* PATCH */}
      <h2>PATCH Update Price</h2>
      <input
        placeholder="new price"
        value={patchPrice}
        onChange={(e) => setPatchPrice(e.target.value)}
      />
      <button onClick={handlePatch}>PATCH</button>

      <hr />

      {/* PUT */}
      <h2>PUT Replace Item</h2>
      <input
        placeholder="itemName"
        value={putName}
        onChange={(e) => setPutName(e.target.value)}
      />
      <input
        placeholder="itemCategory"
        value={putCategory}
        onChange={(e) => setPutCategory(e.target.value)}
      />
      <input
        placeholder="itemPrice"
        value={putPrice}
        onChange={(e) => setPutPrice(e.target.value)}
      />

      <button onClick={handlePut}>PUT</button>
    </div>
  );
}
