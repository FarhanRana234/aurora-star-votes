import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Plus, Minus, RotateCcw, Star, Trophy, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Candidate,
  subscribeToAllCandidates,
  castVote,
  removeVote,
  resetVotes,
} from "@/lib/firebase";

const ADMIN_PASSWORD = "123_farisisgay";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsub = subscribeToAllCandidates(setCandidates);
    return () => unsub();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleIncrement = async (candidateId: string) => {
    setLoading((prev) => ({ ...prev, [candidateId]: true }));
    await castVote(candidateId);
    setLoading((prev) => ({ ...prev, [candidateId]: false }));
  };

  const handleDecrement = async (candidateId: string) => {
    setLoading((prev) => ({ ...prev, [candidateId]: true }));
    await removeVote(candidateId);
    setLoading((prev) => ({ ...prev, [candidateId]: false }));
  };

  const handleReset = async (candidateId: string, name: string) => {
    if (!confirm(`Reset all votes for ${name}?`)) return;
    setLoading((prev) => ({ ...prev, [candidateId]: true }));
    await resetVotes(candidateId);
    toast.success(`Votes reset for ${name}`);
    setLoading((prev) => ({ ...prev, [candidateId]: false }));
  };

  const starCandidates = candidates.filter((c) => c.type === "stars");
  const vendorCandidates = candidates.filter((c) => c.type === "vendors");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          className="bg-card rounded-2xl shadow-card border border-border/50 p-8 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enter password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
            />
            <Button type="submit" className="w-full gold-gradient">
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage votes for all candidates
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.div>

        {/* Star Candidates */}
        <motion.div
          className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="gold-gradient p-4 flex items-center gap-3">
            <Star className="w-6 h-6 text-primary-foreground" />
            <h2 className="text-xl font-display font-bold text-primary-foreground">
              Star of the Month
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {starCandidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                loading={loading[candidate.id]}
                onIncrement={() => handleIncrement(candidate.id)}
                onDecrement={() => handleDecrement(candidate.id)}
                onReset={() => handleReset(candidate.id, candidate.name)}
              />
            ))}
            {starCandidates.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No candidates found
              </p>
            )}
          </div>
        </motion.div>

        {/* Vendor Candidates */}
        <motion.div
          className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="gold-gradient p-4 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary-foreground" />
            <h2 className="text-xl font-display font-bold text-primary-foreground">
              Vendor of the Month
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {vendorCandidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                loading={loading[candidate.id]}
                onIncrement={() => handleIncrement(candidate.id)}
                onDecrement={() => handleDecrement(candidate.id)}
                onReset={() => handleReset(candidate.id, candidate.name)}
              />
            ))}
            {vendorCandidates.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No candidates found
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface CandidateRowProps {
  candidate: Candidate;
  loading?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

const CandidateRow = ({
  candidate,
  loading,
  onIncrement,
  onDecrement,
  onReset,
}: CandidateRowProps) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background">
      {candidate.image && (
        <img
          src={candidate.image}
          alt={candidate.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gold/30"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
        <p className="text-sm text-gold font-medium">
          {candidate.votes || 0} votes
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={onDecrement}
          disabled={loading || (candidate.votes || 0) <= 0}
          className="h-8 w-8"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={onIncrement}
          disabled={loading}
          className="h-8 w-8"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={onReset}
          disabled={loading}
          className="h-8 w-8"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Admin;
