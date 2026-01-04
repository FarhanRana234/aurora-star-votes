import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  description: string;
  votes: number;
}

interface VotingCardProps {
  title: string;
  subtitle: string;
  icon: "star" | "trophy";
  candidates: Candidate[];
  onVote: (candidateId: string) => void;
  isVoting: boolean;
  votedFor: string | null;
  isFirebaseConnected: boolean;
}

const VotingCard = ({
  title,
  subtitle,
  icon,
  candidates,
  onVote,
  isVoting,
  votedFor,
  isFirebaseConnected,
}: VotingCardProps) => {
  const [hoveredCandidate, setHoveredCandidate] = useState<string | null>(null);

  const IconComponent = icon === "star" ? Star : Trophy;

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <motion.div
      className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="gold-gradient p-6 text-center">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <IconComponent className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold text-primary-foreground">
          {title}
        </h2>
        <p className="text-primary-foreground/80 mt-1 text-sm">{subtitle}</p>
      </div>

      {/* Candidates */}
      <div className="p-6 space-y-4">
        {candidates.map((candidate, index) => {
          const votePercentage = totalVotes > 0 
            ? Math.round((candidate.votes / totalVotes) * 100) 
            : 0;
          const hasVoted = votedFor === candidate.id;

          return (
            <motion.div
              key={candidate.id}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300",
                hasVoted
                  ? "border-gold bg-gold/5"
                  : hoveredCandidate === candidate.id
                  ? "border-gold/50 bg-muted/50"
                  : "border-border bg-card"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCandidate(candidate.id)}
              onMouseLeave={() => setHoveredCandidate(null)}
            >
              {/* Progress bar background */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gold/10 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFirebaseConnected ? votePercentage / 100 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {candidate.description}
                  </p>
                  {isFirebaseConnected && (
                    <p className="text-xs text-gold mt-1 font-medium">
                      {candidate.votes} votes ({votePercentage}%)
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => onVote(candidate.id)}
                  disabled={isVoting || hasVoted || !isFirebaseConnected}
                  className={cn(
                    "min-w-[100px] transition-all duration-300",
                    hasVoted && "animate-vote-pop"
                  )}
                  variant={hasVoted ? "default" : "outline"}
                >
                  {hasVoted ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Voted
                    </>
                  ) : isVoting ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    "Vote"
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default VotingCard;
