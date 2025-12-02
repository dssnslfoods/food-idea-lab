-- Drop the delete policy for requirements
DROP POLICY IF EXISTS "Anyone can delete requirements" ON public.requirements;

-- Update the security finding - requirements can be viewed, created, and updated but NOT deleted