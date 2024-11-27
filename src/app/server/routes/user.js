require('dotenv').config(); // Load environment variables
const express = require('express');
const z = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../database/database');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

// JWT secret key (use a secure, random secret in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to authenticate the user based on JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token missing or invalid' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Access token is invalid' });
        }
        req.user = user; // Attach decoded user information to the request object
        next();
    });
}

// Route to retrieve the role of the currently logged-in user
router.get('/get-role', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;

        const { rows } = await client.query(`SELECT role FROM users WHERE email = $1`, [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            role: rows[0].role, // Return the user's role
        });
    } catch (error) {
        console.error('Error fetching user role:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Schema for validating signin data
const signinSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(6).max(20).trim(),
});

// Signin route with role validation
router.post('/signin', async (req, res) => {
    const result = signinSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid inputs',
            errors: result.error.errors,
        });
    }

    try {
        const { email, password } = req.body;

        const { rows } = await client.query(
            `SELECT password, role FROM users WHERE email = $1`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or email not registered',
            });
        }

        const validPassword = await bcrypt.compare(password, rows[0].password);

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }

        // Generate JWT for the authenticated user
        const token = jwt.sign(
            { email, role: rows[0].role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            success: true,
            message: `${rows[0].role.charAt(0).toUpperCase() + rows[0].role.slice(1)} signed in successfully!`,
            role: rows[0].role, // Return the user's role
            token, // Include the JWT in the response
        });
    } catch (error) {
        console.error('Error during signin:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
});

// Schema for validating product data
const productSchema = z.object({
    name: z.string().min(1).max(100).trim(),
    image: z.string().url().trim(),
    credits: z.number().positive().max(10000), // Limit max credits to a reasonable value
});

// Add a new product
router.post('/products', authenticateToken, async (req, res) => {
    const result = productSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product data',
            errors: result.error.errors,
        });
    }

    try {
        const { name, image, credits } = req.body;

        // Check if the user has the 'admin' role (optional)
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to add products',
            });
        }

        // Insert the product into the database
        await client.query(
            `INSERT INTO products (name, image, credits) VALUES ($1, $2, $3)`,
            [name, image, credits]
        );

        res.status(201).json({
            success: true,
            message: 'Product added successfully!',
        });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Fetch all products (with authentication)
router.get('/products', authenticateToken, async (req, res) => {
    try {
        const { rows } = await client.query(`SELECT id, name, image, credits FROM products`);

        res.status(200).json({
            success: true,
            products: rows,
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

module.exports = { userRouter: router };
