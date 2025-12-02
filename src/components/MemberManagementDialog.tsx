import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Trash2, Edit2, X, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").max(255),
  department: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface Member {
  id: string;
  name: string;
  email: string;
  department: string | null;
  role: string | null;
  created_at: string;
}

interface MemberManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembersChange?: () => void;
}

export const MemberManagementDialog = ({
  open,
  onOpenChange,
  onMembersChange,
}: MemberManagementDialogProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      role: "",
    },
  });

  const editForm = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      role: "",
    },
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  const onSubmit = async (data: MemberFormData) => {
    try {
      const { error } = await supabase
        .from('members')
        .insert([{
          name: data.name,
          email: data.email,
          department: data.department || null,
          role: data.role || null,
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("A member with this email already exists");
          return;
        }
        throw error;
      }

      toast.success("Member added successfully!");
      form.reset();
      setShowAddForm(false);
      fetchMembers();
      onMembersChange?.();
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error(error.message || "Failed to add member");
    }
  };

  const onEditSubmit = async (data: MemberFormData) => {
    if (!editingId) return;
    
    try {
      const { error } = await supabase
        .from('members')
        .update({
          name: data.name,
          email: data.email,
          department: data.department || null,
          role: data.role || null,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast.success("Member updated successfully!");
      setEditingId(null);
      fetchMembers();
      onMembersChange?.();
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast.error(error.message || "Failed to update member");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Member removed");
      fetchMembers();
      onMembersChange?.();
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error(error.message || "Failed to remove member");
    }
  };

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    editForm.reset({
      name: member.name,
      email: member.email,
      department: member.department || "",
      role: member.role || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Team Members Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Member Button/Form */}
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium">Add New Member</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. R&D, Quality" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Project Lead" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); form.reset(); }}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Member</Button>
                </div>
              </form>
            </Form>
          )}

          {/* Members Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading members...
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No members yet. Add your first team member above.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      {editingId === member.id ? (
                        <>
                          <TableCell>
                            <Input 
                              {...editForm.register('name')} 
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              {...editForm.register('email')} 
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              {...editForm.register('department')} 
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              {...editForm.register('role')} 
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={editForm.handleSubmit(onEditSubmit)}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.department || '-'}</TableCell>
                          <TableCell>{member.role || '-'}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => startEdit(member)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};