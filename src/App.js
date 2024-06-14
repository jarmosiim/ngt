import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const CONSUMER_KEY = process.env.REACT_APP_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.REACT_APP_CONSUMER_SECRET;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&stock_status=instock&status=publish&page=${page}&per_page=10`;
            console.log(`Fetching products from: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(prevProducts => [...prevProducts, ...data]);
            if (data.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, CONSUMER_KEY, CONSUMER_SECRET, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const observer = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div>
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
            <div ref={observer}></div>
            {loading && <div>Loading...</div>}
        </div>
    );
}

export default App;
