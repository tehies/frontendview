import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CollectionProduct.css';

const CollectionProductGrid = ({ id }) => {
    const [collectionproducts, setCollectionProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const collectionId = id; // Dynamically set your collection ID

    useEffect(() => {
        const fetchCollectionProducts = async () => {
            try {
                const response = await axios.get(`https://vtex-backend.onrender.com/collectionProduct?collectionId=${collectionId}`);
                console.log('API Response:', response);

                // Ensure the 'Data' key is valid
                if (Array.isArray(response.data.Data)) {
                    setCollectionProducts(response.data.Data);
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
        <div className="collection-product-grid">
            {Array.isArray(collectionproducts) && collectionproducts.length > 0 ? (
                collectionproducts.map(collectionproduct => (
                    <div key={collectionproduct.ProductId} className="collection-product-card">
                        <img
                            src={collectionproduct.SkuImageUrl}
                            alt={collectionproduct.ProductName}
                            className="collectionproduct-image"
                        />

                    </div>
                ))
            ) : (
                <div>No products found in this collection.</div>
            )}
        </div>
    );
};

export default CollectionProductGrid;
