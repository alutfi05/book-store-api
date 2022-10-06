const MONGO_DB_CONFIG = {
    DB: "mongodb://127.0.0.1/book-store-project",
    PAGE_SIZE: 10,
};

const STRIPE_CONFIG = {
    STRIPE_KEY:
        "sk_test_51LpnCUELC17kV4b6X4sXtwAThnTxkv8BGB2fEawlSANVzzF760CmuBxXYMwf7CQ0gTqijItCv9yRCWMxKRVxeQ1p00pXsuMck7",
    CURRENCY: "IDR",
};

module.exports = { MONGO_DB_CONFIG, STRIPE_CONFIG };
