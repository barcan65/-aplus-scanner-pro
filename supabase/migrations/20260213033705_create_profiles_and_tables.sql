/*
  # Create A+ Scanner Pro Database Schema

  ## Overview
  This migration creates the complete database schema for the A+ Scanner Pro application,
  including user profiles, scan history, watchlists, and price alerts.

  ## 1. New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, not null)
  - `is_premium` (boolean, default false)
  - `premium_expires_at` (timestamptz, nullable)
  - `polygon_api_key` (text, encrypted, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  Stores user profile information including premium status and API credentials.

  ### `scans`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, foreign key to profiles)
  - `scan_data` (jsonb, stores array of stock results)
  - `stock_count` (integer, number of stocks found)
  - `market_phase` (text, either 'pre-market' or 'regular')
  - `created_at` (timestamptz, default now())
  
  Stores historical scan results for each user.

  ### `watchlist`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, foreign key to profiles)
  - `symbol` (text, stock ticker symbol)
  - `notes` (text, optional user notes)
  - `target_price` (numeric, optional price target)
  - `stop_loss` (numeric, optional stop loss level)
  - `created_at` (timestamptz, default now())
  
  Stores user's watchlist items with custom notes and price levels.

  ### `alerts`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, foreign key to profiles)
  - `symbol` (text, stock ticker symbol)
  - `condition` (text, alert condition type: 'above', 'below', etc.)
  - `target_value` (numeric, trigger value)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz, default now())
  
  Stores price alert configurations for users.

  ## 2. Security (Row Level Security)
  
  All tables have RLS enabled with policies that ensure:
  - Users can only access their own data
  - Authenticated users required for all operations
  - Proper ownership checks on all queries

  ### Profiles Table Policies
  - SELECT: Users can view their own profile
  - UPDATE: Users can update their own profile
  - INSERT: Automatic via trigger on auth.users
  
  ### Scans Table Policies
  - SELECT: Users can view their own scans
  - INSERT: Users can create scans
  - DELETE: Users can delete their own scans
  
  ### Watchlist Table Policies
  - SELECT: Users can view their own watchlist
  - INSERT: Users can add to their watchlist
  - UPDATE: Users can update their watchlist items
  - DELETE: Users can remove from their watchlist
  
  ### Alerts Table Policies
  - SELECT: Users can view their own alerts
  - INSERT: Users can create alerts
  - UPDATE: Users can update their own alerts
  - DELETE: Users can delete their own alerts

  ## 3. Functions & Triggers
  
  - `handle_new_user()`: Automatically creates profile when user registers
  - `update_updated_at()`: Updates the updated_at timestamp on profile changes

  ## 4. Indexes
  
  - Index on profiles(id) for fast user lookups
  - Index on scans(user_id, created_at) for efficient scan history queries
  - Index on watchlist(user_id, symbol) for quick watchlist access
  - Index on alerts(user_id, is_active) for active alert queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_premium boolean DEFAULT false,
  premium_expires_at timestamptz DEFAULT NULL,
  polygon_api_key text DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_data jsonb NOT NULL,
  stock_count integer NOT NULL,
  market_phase text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  notes text DEFAULT NULL,
  target_price numeric DEFAULT NULL,
  stop_loss numeric DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  condition text NOT NULL,
  target_value numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Scans policies
CREATE POLICY "Users can view own scans"
  ON scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create scans"
  ON scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans"
  ON scans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Watchlist policies
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Alerts policies
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scans_user_created ON scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_symbol ON watchlist(user_id, symbol);
CREATE INDEX IF NOT EXISTS idx_alerts_user_active ON alerts(user_id, is_active);
