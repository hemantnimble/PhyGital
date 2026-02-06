'use client';

import React, { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productData = {
      title: title || null,
      price: price ? Number(price) : null,
      category: category || null,
      stock: Number(stock),
      images: images
        ? images.split(",").map((img) => img.trim())
        : [],
    };

    try {
      await axios.post("/api/products/add", productData);
      alert("Product added successfully");

      // reset form
      setTitle("");
      setPrice("");
      setCategory("");
      setStock("");
      setImages("");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  return (
    <section className="mx-auto max-w-xl p-6">
      <h2 className="mb-6 text-xl font-semibold">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded border p-2"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border p-2"
        />

        <input
          type="number"
          placeholder="Stock"
          required
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full rounded border p-2"
        />

        {/* Images as comma-separated URLs */}
        <input
          type="text"
          placeholder="Image URLs (comma separated)"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="w-full rounded border p-2"
        />

        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-white"
        >
          Add Product
        </button>
      </form>
    </section>
  );
}
