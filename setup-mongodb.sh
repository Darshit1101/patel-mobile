#!/bin/bash

# MongoDB Setup Script for Patel Mobile Management System
# This script helps set up MongoDB for local development

echo "🚀 Setting up MongoDB for Patel Mobile Management System"
echo "========================================================="

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "❌ MongoDB is not installed"
    echo ""
    echo "Please install MongoDB:"
    echo "- macOS: brew install mongodb/brew/mongodb-community"
    echo "- Ubuntu: sudo apt-get install mongodb"
    echo "- Windows: Download from https://www.mongodb.com/try/download/community"
    exit 1
fi

# Check if MongoDB is running
if pgrep mongod > /dev/null; then
    echo "✅ MongoDB is already running"
else
    echo "🔄 Starting MongoDB..."
    # Try to start MongoDB (works on macOS with Homebrew)
    if command -v brew &> /dev/null; then
        brew services start mongodb/brew/mongodb-community
        sleep 3
        if pgrep mongod > /dev/null; then
            echo "✅ MongoDB started successfully"
        else
            echo "❌ Failed to start MongoDB automatically"
            echo "Please start MongoDB manually: mongod"
            exit 1
        fi
    else
        echo "Please start MongoDB manually:"
        echo "- Linux/Windows: mongod"
        echo "- macOS: brew services start mongodb/brew/mongodb-community"
        exit 1
    fi
fi

# Test MongoDB connection
echo "🔍 Testing MongoDB connection..."
if mongosh --eval "db.runCommand('ping').ok" patel-mobile --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful"
else
    echo "❌ Failed to connect to MongoDB"
    echo "Please check if MongoDB is running on default port 27017"
    exit 1
fi

# Create database and sample data
echo "📊 Setting up database..."
mongosh patel-mobile --eval "
// Create sample combo 1
db.combos.insertOne({
    comboName: 'Premium Package',
    mobileNames: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'OnePlus 12'],
    createdAt: new Date(),
    updatedAt: new Date()
});

// Create sample combo 2
db.combos.insertOne({
    comboName: 'Budget Package', 
    mobileNames: ['Redmi Note 13', 'Realme 11'],
    createdAt: new Date(),
    updatedAt: new Date()
});

// Create sample combo 3
db.combos.insertOne({
    comboName: 'Gaming Package',
    mobileNames: ['ASUS ROG Phone 8', 'RedMagic 9 Pro', 'Black Shark 5 Pro', 'Nubia Red Magic'],
    createdAt: new Date(),
    updatedAt: new Date()
});

console.log('Sample combos created successfully');
" --quiet

echo ""
echo "🎉 MongoDB setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "The database 'patel-mobile' has been created with sample data."