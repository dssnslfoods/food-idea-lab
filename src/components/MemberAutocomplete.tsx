import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  email: string;
  department: string | null;
  role: string | null;
}

interface MemberAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onValidMember?: (isValid: boolean) => void;
}

export const MemberAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter member name",
  className,
  onValidMember,
}: MemberAutocompleteProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    fetchMembers();
  }, []);

  useEffect(() => {
    if (value.trim()) {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }

    // Check if the current value matches a valid member
    const isValid = members.some(
      member => member.name.toLowerCase() === value.toLowerCase()
    );
    onValidMember?.(isValid);
  }, [value, members, onValidMember]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (member: Member) => {
    onChange(member.name);
    setShowSuggestions(false);
    onValidMember?.(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[200px] overflow-y-auto">
          {isLoading ? (
            <div className="p-2 text-sm text-muted-foreground">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">
              {members.length === 0 ? "No members registered yet" : "No matching members"}
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-accent transition-colors",
                  member.name.toLowerCase() === value.toLowerCase() && "bg-accent"
                )}
                onClick={() => handleSelect(member)}
              >
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">
                  {member.email}
                  {member.department && ` • ${member.department}`}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};