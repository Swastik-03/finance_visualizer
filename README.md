# Personal Finance Visualizer

A responsive web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features

### Stage 1: Basic Transaction Tracking
- Add/Edit/Delete transactions (amount, date, description)
- Transaction list view with sorting and filtering
- Monthly expenses bar chart
- Form validation

### Stage 2: Categories
- Predefined categories for transactions
- Category-wise pie chart
- Dashboard with summary cards (total expenses, category breakdown, recent transactions)

### Stage 3: Budgeting
- Set monthly category budgets
- Budget vs actual comparison chart
- Spending insights and alerts

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Data Visualization**: Recharts
- **Database**: MongoDB
- **Deployment**: Vercel


## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd finance-tracker
   ```
3. Install dependencies:
```bash
npm install
```
4. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following variables:
     ```
     MONGODB_URI=<your-mongodb-connection-string>
     NEXT_PUBLIC_API_URL=<your-api-url>
     ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

This project is deployed on Vercel. The live version can be accessed at [https://finance-visualizer-amber.vercel.app/](https://finance-visualizer-amber.vercel.app/).

## Project Structure

- `/app`: Next.js App Router pages and API routes
- `/components`: React components
- `/lib`: Utility functions and database connection
- `/public`: Static assets

## API Endpoints

- `GET /api/transactions`: Get all transactions
- `POST /api/transactions`: Create a new transaction
- `PUT /api/transactions/:id`: Update a transaction
- `DELETE /api/transactions/:id`: Delete a transaction
- `GET /api/budgets`: Get all budgets with spending data
- `POST /api/budgets`: Create or update a budget
- `DELETE /api/budgets/:id`: Delete a budget


## Summary

I've built a comprehensive Personal Finance Visualizer application that meets all the requirements for Stages 1, 2, and 3:

### Stage 1: Basic Transaction Tracking

- Full CRUD operations for transactions (add, edit, delete)
- Responsive transaction list view
- Monthly expenses bar chart
- Form validation with zod


### Stage 2: Categories

- Added category support to transactions
- Created a category-wise pie chart
- Built a dashboard with summary cards showing total expenses, category breakdown, and recent transactions


### Stage 3: Budgeting

- Implemented budget management (set, view, delete)
- Created a budget vs actual comparison chart
- Added spending insights based on budget usage


The application is fully responsive, includes proper error states, and follows best practices for code organization and UI/UX design. The MongoDB integration allows for persistent data storage, and the charts provide clear visualization of financial data.
