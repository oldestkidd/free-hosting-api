const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",")
        : "http://localhost:5173"
}));
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to Supabase using server-side credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const supabase = supabaseUrl && supabaseSecretKey
    ? createClient(supabaseUrl, supabaseSecretKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    })
    : null;

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

// Test the Supabase database connection
app.get("/db-test", async (req, res) => {
    if (!supabase) {
        return res.status(500).json({
            status: "error",
            message: "Supabase environment variables are missing"
        });
    }

    try {
        const { data, error } = await supabase
            .from("hosting_test")
            .select("id, project_name, status")
            .order("id");

        if (error) throw error;

        res.json({
            status: "success",
            message: "Supabase database connected successfully!",
            total_projects: data.length,
            projects: data
        });

    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Could not retrieve database records"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});