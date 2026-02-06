-- Create dividers table
CREATE TABLE public.dividers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Star',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create todos table
CREATE TABLE public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  divider_id UUID NOT NULL REFERENCES public.dividers(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Star',
  completions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create mood_notes table
CREATE TABLE public.mood_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  mood TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.dividers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for dividers
CREATE POLICY "Users can view their own dividers" ON public.dividers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own dividers" ON public.dividers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dividers" ON public.dividers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dividers" ON public.dividers FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for todos
CREATE POLICY "Users can view their own todos" ON public.todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own todos" ON public.todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own todos" ON public.todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own todos" ON public.todos FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for mood_notes
CREATE POLICY "Users can view their own mood_notes" ON public.mood_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood_notes" ON public.mood_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood_notes" ON public.mood_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood_notes" ON public.mood_notes FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_dividers_updated_at BEFORE UPDATE ON public.dividers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON public.todos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mood_notes_updated_at BEFORE UPDATE ON public.mood_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();