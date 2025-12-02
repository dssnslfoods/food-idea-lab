import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { StatsOverview } from "@/components/StatsOverview";
import { WorkflowStages } from "@/components/WorkflowStages";
import { RequirementCard } from "@/components/RequirementCard";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

type Requirement = {
  id: string;
  title: string;
  description: string;
  stage: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  due_date: string;
};

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);
      fetchRequirements(user.id);
    };

    checkAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session?.user) {
        setUser(session.user);
        fetchRequirements(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchRequirements = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequirements((data || []) as Requirement[]);
    } catch (error: any) {
      console.error('Error fetching requirements:', error);
      toast.error("Failed to load requirements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <main className="container mx-auto max-w-7xl space-y-12 px-6 py-8">
        <StatsOverview />
        
        <WorkflowStages />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Your Requirements</h2>
            <NewProjectDialog onSuccess={() => fetchRequirements(user.id)} />
          </div>
          
          {requirements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No requirements yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {requirements.map((req, index) => (
                <div key={req.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <RequirementCard 
                    id={req.id}
                    title={req.title}
                    description={req.description}
                    stage={req.stage}
                    priority={req.priority}
                    assignee={req.assignee}
                    dueDate={req.due_date}
                    onUpdate={() => fetchRequirements(user.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
