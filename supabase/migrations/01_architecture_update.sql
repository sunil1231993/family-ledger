-- New Enum for Transaction Category
CREATE TYPE transaction_category AS ENUM ('principal', 'interest', 'committee', 'investment_profit', 'generic');

-- Modify Transactions Table
ALTER TABLE public.transactions ADD COLUMN category transaction_category DEFAULT 'generic'::transaction_category;
ALTER TABLE public.transactions ADD COLUMN investment_id UUID;
ALTER TABLE public.transactions ADD COLUMN committee_id UUID;

-- Investments Table
CREATE TABLE public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  principal_amount NUMERIC(10, 2) NOT NULL,
  expected_monthly_profit NUMERIC(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Committees Table (Replaces old committee_payments which was just a log)
DROP TABLE IF EXISTS public.committee_payments CASCADE;

CREATE TABLE public.committees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  monthly_installment NUMERIC(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Foreign Key Constraints to Transactions
ALTER TABLE public.transactions ADD CONSTRAINT fk_investment FOREIGN KEY (investment_id) REFERENCES public.investments(id) ON DELETE SET NULL;
ALTER TABLE public.transactions ADD CONSTRAINT fk_committee FOREIGN KEY (committee_id) REFERENCES public.committees(id) ON DELETE SET NULL;

-- Enable RLS on New Tables
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;

-- Investments Policies
CREATE POLICY "Users can view their own investments" ON public.investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all investments" ON public.investments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Committees Policies
CREATE POLICY "Users can view their own committees" ON public.committees
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all committees" ON public.committees
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
