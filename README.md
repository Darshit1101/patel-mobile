# Patel Mobile Management System

A simplified full-stack Next.js application for managing mobile phone combos with dynamic mobile names using MongoDB.

## Features

- ✅ **Simple Form Structure**: Only two fields - Combo Name and Mobile Names
- ✅ **Dynamic Mobile Names**: Add multiple mobile names (2, 3, 4+ as needed)
- ✅ **Full CRUD Operations**: Create, read, update, delete combos
- ✅ **MongoDB Integration**: Simple two-field database structure
- ✅ **Responsive Design**: Modern UI with Tailwind CSS
- ✅ **User-Friendly Interface**: Easy add/remove mobile name fields

## Database Structure

The application uses a simple MongoDB structure with just **two fields**:

```javascript
{
  comboName: String (required),           // Field 1: Combo Name
  mobileNames: [String] (required),       // Field 2: Array of Mobile Names
  createdAt: Date,                        // Auto-generated
  updatedAt: Date                         // Auto-generated
}
```

**Example Document:**
```javascript
{
  comboName: "Premium Package",
  mobileNames: ["iPhone 15 Pro", "Samsung Galaxy S24", "OnePlus 12"],
  createdAt: "2025-10-20T15:30:00.000Z",
  updatedAt: "2025-10-20T15:30:00.000Z"
}
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with responsive design
- **Development**: Turbopack for fast development

## Project Structure

```
patel-mobile/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── combos/        # Combo CRUD endpoints
│   │   │   └── mobiles/       # Mobile CRUD endpoints
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/            # React components
│   │   ├── ComboForm.jsx      # Combo form component
│   │   ├── ComboList.jsx      # Combo list component
│   │   ├── MobileForm.jsx     # Mobile form component
│   │   └── MobileList.jsx     # Mobile list component
│   ├── lib/                   # Utility libraries
│   │   └── mongodb.js         # Database connection
│   └── models/                # Mongoose models
│       ├── Combo.js           # Combo schema
│       └── Mobile.js          # Mobile schema
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally, or MongoDB Atlas account
- Git (optional)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd patel-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/patel-mobile
   ```

   **For MongoDB Atlas (cloud):**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/patel-mobile
   ```

4. **Start MongoDB (if using local installation)**
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Linux/Windows
   mongod
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### Adding a New Combo

1. **Enter Combo Name**: Type your combo package name in the first field
2. **Add Mobile Names**: 
   - Start with one mobile name field
   - Click "+ Add Mobile" to add more mobile name fields
   - You can add as many mobile names as needed (2, 3, 4, 5...)
   - Use "Remove" button to delete unwanted mobile name fields
3. **Save**: Click "Add Combo" to save

### Managing Existing Combos

- **Edit**: Click "Edit" button to modify combo name or mobile names
- **Delete**: Click "Delete" button to remove entire combo
- **View**: All combos are displayed in a clean table format

### Form Features

- **Dynamic Fields**: Add/remove mobile name fields as needed
- **Validation**: Ensures combo name and at least one mobile name is provided
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices

## API Endpoints

- `GET /api/combos` - Get all combos
- `POST /api/combos` - Create new combo
- `PUT /api/combos/[id]` - Update existing combo
- `DELETE /api/combos/[id]` - Delete combo

## Features in Detail

### Validation
- **Client-side**: Form validation with error messages
- **Server-side**: Mongoose schema validation
- **Business Logic**: Prevents deletion of combos with associated mobiles

### UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tab Navigation**: Switch between Combos and Mobiles management
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

### Data Relationships
- Each mobile phone must be associated with a combo
- Combo deletion is prevented if mobiles are linked
- Automatic population of combo data in mobile listings

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Adding New Features

1. **New API Route**: Add to `src/app/api/`
2. **New Component**: Add to `src/components/`
3. **New Model**: Add to `src/models/`
4. **Database Utilities**: Add to `src/lib/`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env.local`
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Next.js will automatically use an available port
   - Or manually specify: `npm run dev -- --port 3001`

3. **Module Not Found**
   - Run `npm install` to ensure all dependencies are installed
   - Check import paths are correct

### Database Issues

1. **Reset Database**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Switch to database
   use patel-mobile
   
   # Drop collections
   db.combos.drop()
   db.mobiles.drop()
   ```

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

- Ensure `MONGODB_URI` is set in production environment
- Run `npm run build` and `npm run start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
- Check this README
- Review the code comments
- Create an issue in the repository
