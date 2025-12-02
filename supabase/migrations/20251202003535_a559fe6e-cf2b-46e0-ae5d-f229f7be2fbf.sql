-- Create comments table for requirement discussions
CREATE TABLE public.requirement_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requirement_id UUID NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requirement_comments ENABLE ROW LEVEL SECURITY;

-- Public access policies (same as requirements)
CREATE POLICY "Anyone can view comments" 
ON public.requirement_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create comments" 
ON public.requirement_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete comments" 
ON public.requirement_comments 
FOR DELETE 
USING (true);

-- Add index for better performance
CREATE INDEX idx_requirement_comments_requirement_id ON public.requirement_comments(requirement_id);