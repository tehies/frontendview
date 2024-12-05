import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for routing

const CollectionPage = ({ id }) => {
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const collectionId = id; // Dynamically set your collection ID

    useEffect(() => {
        const fetchCollectionProducts = async () => {
            try {
                // Fetch collection products
                const response = await axios.get(`https://vtex-backend-791k.onrender.com/collectionProduct?collectionId=${collectionId}`);
                // const response = await axios.get(`https://vtex-backend.onrender.com/collectionProduct?collectionId=${collectionId}`);
                console.log('API Response:', response);

                if (Array.isArray(response.data.Data)) {
                    const products = response.data.Data;

                    // Fetch prices for each product
                    const productsWithPrices = await Promise.all(
                        products.map(async (product) => {
                            try {
                                // const priceResponse = await axios.get(`https://vtex-backend.onrender.com/pricing/${product.SkuId}`);
                                const priceResponse = await axios.get(`https://vtex-backend-791k.onrender.com/pricing/${product.SkuId}`);
                                console.log(`Price for SkuId ${product.SkuId}:`, priceResponse.data.basePrice);

                                // Add the price to the product object
                                return { ...product, Price: priceResponse.data.basePrice || 0 };
                            } catch (err) {
                                console.error(`Error fetching price for SkuId ${product.SkuId}:`, err);
                                return { ...product, Price: 0 }; // Default price to 0 if API fails
                            }
                        })
                    );

                    setCollectionProducts(productsWithPrices);
                } else {
                    setError('Data is not an array');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchCollectionProducts();
    }, [collectionId]);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <p>Loading collection products...</p>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="collection-product-container">
            <h1 className="product-heading">Collection Products</h1>

            <div className="product-grid">
                {Array.isArray(collectionProducts) && collectionProducts.length > 0 ? (
                    collectionProducts.map((product) => (
                        <Link key={product.SkuId} to={`/product/${product.SkuId}`} className="product-card-link">
                            <div key={product.ProductId} className="product-card">
                                <img
                                    src={product.SkuImageUrl || 'default-image.jpg'}
                                    alt={product.ProductName}
                                    className="product-image"
                                />
                                <div className="product-name">{product.ProductName}</div>
                                <p className="product-price">
                                    {product.Price ? `$${(product.Price / 100).toFixed(2)}` : 'Price not available'}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div>No products found in this collection.</div>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
