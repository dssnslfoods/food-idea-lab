-- Create a table to track project stage history
CREATE TABLE public.project_stage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requirement_id UUID NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_stage_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view stage history" 
ON public.project_stage_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create stage history" 
ON public.project_stage_history 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_project_stage_history_requirement_id ON public.project_stage_history(requirement_id);
CREATE INDEX idx_project_stage_history_changed_at ON public.project_stage_history(requirement_id, changed_at);