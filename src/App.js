import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!products || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <div className="App">
            {products.map((product, index) => (
                <div key={index}>
                    <h2>{product.name}</h2>
                    {product.src ? (
                        <img src={product.src} alt={product.name} />
                    ) : (
                        <p>Image not available</p>
                    )}
                    <p>{product.description}</p>
                </div>
            ))}
        </div>
    );
}

export default App;
