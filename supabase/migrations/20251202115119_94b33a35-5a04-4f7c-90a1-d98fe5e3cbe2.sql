-- Add stage column to requirement_comments table
ALTER TABLE public.requirement_comments 
ADD COLUMN stage TEXT;