-- Create Enum Types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Loans Table
CREATE TABLE public.loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  principal_amount NUMERIC(10, 2) NOT NULL,
  interest_rate NUMERIC(5, 2) NOT NULL, -- percentage
  is_monthly BOOLEAN DEFAULT true NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transactions Table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  loan_id UUID REFERENCES public.loans(id) ON DELETE SET NULL, -- Can be null for committee or general payments
  amount NUMERIC(10, 2) NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending'::transaction_status NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Committee Payments Table
CREATE TABLE public.committee_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0 NOT NULL,
  total_expected NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Loans Policies
CREATE POLICY "Users can view their own loans" ON public.loans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all loans" ON public.loans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions Policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pending transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view and manage all transactions" ON public.transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Committee Policies
CREATE POLICY "Users can view their own committee records" ON public.committee_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all committee records" ON public.committee_payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
