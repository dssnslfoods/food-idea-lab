-- Make user_id nullable since we're removing auth
ALTER TABLE public.requirements ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can create their own requirements" ON public.requirements;
DROP POLICY IF EXISTS "Users can delete their own requirements" ON public.requirements;
DROP POLICY IF EXISTS "Users can update their own requirements" ON public.requirements;
DROP POLICY IF EXISTS "Users can view their own requirements" ON public.requirements;

-- Create new public access policies
CREATE POLICY "Anyone can view requirements" 
ON public.requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create requirements" 
ON public.requirements 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update requirements" 
ON public.requirements 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete requirements" 
ON public.requirements 
FOR DELETE 
USING (true);