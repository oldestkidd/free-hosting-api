const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "My shared backend API is running!",
        status: "success"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "free-hosting-api"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});