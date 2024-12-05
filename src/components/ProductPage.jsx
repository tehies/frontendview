
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';

const ProductPage = () => {
    const skuId = useParams().id; // Get SKU ID from URL
    const [sku, setSku] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkuAndPrice = async () => {
            try {
                // Fetch SKU details
                const skuResponse = await axios.get(`http://localhost:3000/sku/${skuId}`);
                // const skuResponse = await axios.get(`https://vtex-backend.onrender.com/sku/${skuId}`);
                setSku(skuResponse.data);

                // Fetch Pricing details
                const pricingResponse = await axios.get(`http://localhost:3000/pricing/${skuId}`);
                // const pricingResponse = await axios.get(`https://vtex-backend.onrender.com/pricing/${skuId}`);
                setPrice(pricingResponse.data.basePrice); // Extract `basePrice` from the pricing response
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        fetchSkuAndPrice();
    }, [skuId]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return sku ? (
        <div className="single_product-page-container">
            <div className="single_product-header">
                <h1>{sku.NameComplete || 'Product Name Not Available'}</h1>
            </div>
            <div className="single_product-details">
                <div className="single_product-images">
                    {sku.Images?.length > 0 ? (
                        <>
                            {/* First image large */}
                            <img
                                src={sku.Images[0].ImageUrl}
                                alt={sku.Images[0].ImageName || 'Main Image'}
                                className="single_product-main-img"
                            />
                            {/* Other images smaller */}
                            <div className="single_product-thumbnails">
                                {sku.Images.slice(1).map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.ImageUrl}
                                        alt={image.ImageName || `Thumbnail ${index + 1}`}
                                        className="single_product-thumbnail-img"
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <img
                            src="default-image.jpg"
                            alt="Default Product"
                            className="single_product-main-img"
                        />
                    )}
                </div>
                <div className="single_product-info">
                    <h1>{sku.NameComplete || 'Product Name Not Available'}</h1>
                    <p className="single_product-description">
                        {sku.ProductDescription || 'No description available'}
                    </p>
                    <p className="single_product-price">
                        Price: {price ? `$${(price / 100).toFixed(2)}` : `${0}`}
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <div className="not-found-message">SKU not found</div>
    );
};

export default ProductPage;
