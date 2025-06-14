# webcastletest_backend
This is a Node.js + Express backend application for managing products with basic CRUD operations.

Features 

    RESTful API endpoints for product management
    
    MongoDB database integration
    
    Input validation
    
    Error handling

API Endpoints :- 

    GET /api/products - Get all products
    
    GET /api/products/:id - Get product by ID
    
    POST /api/products - Create a new product
    
    PUT /api/products/:id - Update existing product
    
    DELETE /api/products/:id - Delete a product

Product Schema 
 {
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String }
}

Prerequisites :- 

  Node.js (v14 or higher)

  npm or yarn
  
  MongoDB (local or cloud instance)

Installation :- 

  Clone the repository :- 
  git clone <repository-url>cd <project-folder>

  Install dependencies :- 
    npm install

  Create a .env file in the root directory and add your environment variables: - 

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/productdb

  Start the development server :- 

    npm start

  Testing :- 

    npm test 

  Technologies Used :- 

    Node.js

    Express.js
    
    MongoDB (with Mongoose)
    

