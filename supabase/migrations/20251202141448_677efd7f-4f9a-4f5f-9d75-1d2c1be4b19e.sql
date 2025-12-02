-- Create members table for team member management
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required per app design)
CREATE POLICY "Anyone can view members"
ON public.members
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create members"
ON public.members
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update members"
ON public.members
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete members"
ON public.members
FOR DELETE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();