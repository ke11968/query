import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          price: parseFloat(price),
        }),
      });

      const newProduct = await response.json();

      setProducts([newProduct, ...products]);

      setTitle('');
      setPrice('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="App">
      <h1>Product Management</h1>

      <div className="add-product-form">
        <h2>Add New Product</h2>
        <form onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Product name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="products-container">
        <h2>Products List ({products.length} items)</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.thumbnail || 'https://via.placeholder.com/150'}
                alt={product.title}
              />
              <h3>{product.title}</h3>
              <p className="price">${product.price}</p>
              <button
                className="delete-btn"
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
