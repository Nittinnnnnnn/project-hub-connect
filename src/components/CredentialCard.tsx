import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, User, Copy, Eye, EyeOff, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditCredentialModal from "./EditCredentialModal";

interface CredentialCardProps {
  credential: {
    id: string;
    title: string;
    username: string;
    password: string;
    website: string;
    notes: string;
    category: string;
  };
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const CredentialCard = ({ credential, onDelete, onUpdate }: CredentialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      social: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      work: "bg-green-500/10 text-green-500 border-green-500/20",
      finance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      general: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return colors[category] || colors.general;
  };

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow bg-card/95 backdrop-blur-sm border-2">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{credential.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(credential.category)}`}>
                {credential.category}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                className="h-8 w-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(credential.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {credential.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a
                href={credential.website.startsWith("http") ? credential.website : `https://${credential.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {credential.website}
              </a>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{credential.username}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(credential.username, "Username")}
                className="h-8 w-8 flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm font-mono truncate">
                  {showPassword ? credential.password : "••••••••"}
                </span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(credential.password, "Password")}
                  className="h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {credential.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">{credential.notes}</p>
          )}
        </div>
      </Card>

      <EditCredentialModal
        credential={credential}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
};

export default CredentialCard;