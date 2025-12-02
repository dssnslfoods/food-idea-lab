import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Calendar, MessageSquare, Send, ArrowRight, History } from "lucide-react";
import { format } from "date-fns";

const updateSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  stage: z.string().min(1, "Stage is required"),
});

const commentSchema = z.object({
  author_name: z.string().min(1, "Name is required").max(100),
  content: z.string().min(1, "Comment is required").max(1000),
});

type UpdateData = z.infer<typeof updateSchema>;
type CommentData = z.infer<typeof commentSchema>;

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface StageHistory {
  id: string;
  stage: string;
  changed_at: string;
}

interface Requirement {
  id: string;
  title: string;
  description: string;
  stage: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  due_date: string;
}

interface RequirementDetailDialogProps {
  requirement: Requirement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const RequirementDetailDialog = ({ 
  requirement, 
  open, 
  onOpenChange,
  onSuccess 
}: RequirementDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [stageHistory, setStageHistory] = useState<StageHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const form = useForm<UpdateData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      description: requirement.description,
      stage: requirement.stage,
    },
  });

  const commentForm = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      author_name: "",
      content: "",
    },
  });

  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-secondary text-secondary-foreground",
    low: "bg-accent text-accent-foreground",
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('requirement_comments')
        .select('*')
        .eq('requirement_id', requirement.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const fetchStageHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('project_stage_history')
        .select('*')
        .eq('requirement_id', requirement.id)
        .order('changed_at', { ascending: true });

      if (error) throw error;
      setStageHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching stage history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
      fetchStageHistory();
    }
  }, [open, requirement.id]);

  const onSubmit = async (data: UpdateData) => {
    try {
      const stageChanged = data.stage !== requirement.stage;

      const { error } = await supabase
        .from('requirements')
        .update({
          description: data.description,
          stage: data.stage,
        })
        .eq('id', requirement.id);

      if (error) throw error;

      // Record stage change in history if stage was changed
      if (stageChanged) {
        const { error: historyError } = await supabase
          .from('project_stage_history')
          .insert([{
            requirement_id: requirement.id,
            stage: data.stage,
          }]);

        if (historyError) {
          console.error('Error recording stage history:', historyError);
        }
      }

      toast.success("Project updated successfully!");
      setIsEditing(false);
      onSuccess?.();
      
      // Refresh stage history
      if (stageChanged) {
        fetchStageHistory();
      }
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(error.message || "Failed to update project");
    }
  };

  const onSubmitComment = async (data: CommentData) => {
    try {
      const { error } = await supabase
        .from('requirement_comments')
        .insert([{
          requirement_id: requirement.id,
          author_name: data.author_name,
          content: data.content,
        }]);

      if (error) throw error;

      toast.success("Comment added!");
      commentForm.reset({ author_name: data.author_name, content: "" });
      fetchComments();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || "Failed to add comment");
    }
  };

  const handleCancel = () => {
    form.reset({
      description: requirement.description,
      stage: requirement.stage,
    });
    setIsEditing(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      form.reset({
        description: requirement.description,
        stage: requirement.stage,
      });
      setIsEditing(false);
    }
    onOpenChange(newOpen);
  };

  // Render stage progression
  const renderStageProgression = () => {
    if (isLoadingHistory) {
      return <span className="text-muted-foreground text-sm">Loading history...</span>;
    }

    if (stageHistory.length === 0) {
      return (
        <span className="text-muted-foreground text-sm italic">
          No stage changes recorded yet
        </span>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        {stageHistory.map((history, index) => (
          <div key={history.id} className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {history.stage}
            </Badge>
            {index < stageHistory.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{requirement.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Read-only info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-4">
            <Badge className={priorityColors[requirement.priority]}>
              {requirement.priority.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{requirement.assignee}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{requirement.due_date}</span>
            </div>
          </div>

          {/* Stage History */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">Stage Progression</h4>
            </div>
            {renderStageProgression()}
          </div>

          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Product Concept">Product Concept</SelectItem>
                          <SelectItem value="Screen Test">Screen Test</SelectItem>
                          <SelectItem value="Testing Validation">Testing Validation</SelectItem>
                          <SelectItem value="First Batch">First Batch</SelectItem>
                          <SelectItem value="Post Launch">Post Launch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter project description" 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 justify-end">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Stage</h4>
                <Badge variant="outline" className="text-base">
                  {requirement.stage}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-foreground whitespace-pre-wrap">{requirement.description}</p>
              </div>

              <div className="flex gap-4 justify-end">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Comments & Responses</h3>
              <Badge variant="secondary">{comments.length}</Badge>
            </div>

            {/* Existing Comments */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {isLoadingComments ? (
                <p className="text-muted-foreground text-center py-4">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to respond!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{comment.author_name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "dd MMM yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap pl-10">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <Form {...commentForm}>
              <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-4 border-t pt-4">
                <FormField
                  control={commentForm.control}
                  name="author_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={commentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your comment or response..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
