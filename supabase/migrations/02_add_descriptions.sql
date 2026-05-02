-- Add description column to investments, loans and committees
ALTER TABLE public.investments ADD COLUMN description TEXT;
ALTER TABLE public.loans ADD COLUMN description TEXT;
ALTER TABLE public.committees ADD COLUMN description TEXT;
