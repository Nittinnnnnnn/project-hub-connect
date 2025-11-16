import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, KeyRound, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CredentialCard from "@/components/CredentialCard";
import AddCredentialModal from "@/components/AddCredentialModal";

interface Credential {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  category: string;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        fetchCredentials();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching credentials",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("credentials")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Credential deleted",
        description: "The credential has been removed.",
      });
      
      fetchCredentials();
    } catch (error: any) {
      toast({
        title: "Error deleting credential",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredCredentials = credentials.filter((cred) =>
    cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <KeyRound className="w-12 h-12 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">VaultX</h1>
              <p className="text-sm text-muted-foreground">{credentials.length} credentials stored</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Credential
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCredentials.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <KeyRound className="w-16 h-16 mx-auto text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">No credentials yet</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "No credentials match your search" : "Start by adding your first credential"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Credential
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onDelete={handleDelete}
                onUpdate={fetchCredentials}
              />
            ))}
          </div>
        )}

        <AddCredentialModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={fetchCredentials}
        />
      </div>
    </div>
  );
};

export default Dashboard;