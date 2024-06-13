import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const CONSUMER_KEY = process.env.REACT_APP_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.REACT_APP_CONSUMER_SECRET;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${BASE_URL}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
                console.log(`Fetching products from: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [BASE_URL, CONSUMER_KEY, CONSUMER_SECRET]);

    if (loading) {
        return (
            <div className="loaderText">
                <h2>Just a moment. Fetching products...</h2>
            </div>
        );
    }

    return (
        <ul>
            {products.length > 0 ? (
                products.map((product) => (
                    <li key={product.id}>
                        <Link to={`/product/${product.id}`}>
                            {product.images && product.images[0] ? (
                                <img src={product.images[0].src} alt="Product banner" />
                            ) : (
                                <p>Image not available</p>
                            )}
                            <h2>{product.name}</h2>
                            <p>Sale price: {product.sale_price}</p>
                            <strong>
                                {product.stock_status === 'instock'
                                    ? 'In stock'
                                    : 'Out of stock'}
                            </strong>
                            <button>Add to Cart</button>
                        </Link>
                    </li>
                ))
            ) : (
                <li>No products found</li>
            )}
        </ul>
    );
}

export default App;
