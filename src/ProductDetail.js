import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!id) {
                    throw new Error('Product ID is undefined');
                }
                const BASE_URL = process.env.REACT_APP_BASE_URL;
                const CONSUMER_KEY = process.env.REACT_APP_CONSUMER_KEY;
                const CONSUMER_SECRET = process.env.REACT_APP_CONSUMER_SECRET;
                const url = `${BASE_URL}/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
                console.log(`Fetching product from: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            {product.images && product.images.length > 0 && product.images[0].src ? (
                <img src={product.images[0].src} alt="Product banner" />
            ) : (
                <p>Image not available</p>
            )}
            <p>{product.description}</p>
            {/* Other product details */}
        </div>
    );
}

export default ProductDetail;
