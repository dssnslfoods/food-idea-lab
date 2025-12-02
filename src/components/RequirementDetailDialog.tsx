import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Clock, User, Calendar } from "lucide-react";

const updateSchema = z.object({
  description: z.string().min(1, "Description is required").max(500),
  stage: z.string().min(1, "Stage is required"),
});

type UpdateData = z.infer<typeof updateSchema>;

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

  const form = useForm<UpdateData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      description: requirement.description,
      stage: requirement.stage,
    },
  });

  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-secondary text-secondary-foreground",
    low: "bg-accent text-accent-foreground",
  };

  const onSubmit = async (data: UpdateData) => {
    try {
      const { error } = await supabase
        .from('requirements')
        .update({
          description: data.description,
          stage: data.stage,
        })
        .eq('id', requirement.id);

      if (error) throw error;

      toast.success("Requirement updated successfully!");
      setIsEditing(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating requirement:', error);
      toast.error(error.message || "Failed to update requirement");
    }
  };

  const handleCancel = () => {
    form.reset({
      description: requirement.description,
      stage: requirement.stage,
    });
    setIsEditing(false);
  };

  // Reset form when requirement changes
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Testing">Testing</SelectItem>
                          <SelectItem value="Production">Production</SelectItem>
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
                          placeholder="Enter requirement description" 
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
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Stage</h4>
                <Badge variant="outline" className="text-base">
                  {requirement.stage}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-foreground whitespace-pre-wrap">{requirement.description}</p>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
