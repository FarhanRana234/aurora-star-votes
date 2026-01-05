import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/Header";
import VotingCard from "@/components/VotingCard";
import { 
  castVote, 
  subscribeToCandidates,
  Candidate 
} from "@/lib/firebase";

const Index = () => {
  const [starCandidates, setStarCandidates] = useState<Candidate[]>([]);
  const [vendorCandidates, setVendorCandidates] = useState<Candidate[]>([]);
  const [isVotingStar, setIsVotingStar] = useState(false);
  const [isVotingVendor, setIsVotingVendor] = useState(false);
  const [votedStar, setVotedStar] = useState<string | null>(null);
  const [votedVendor, setVotedVendor] = useState<string | null>(null);

  // Check localStorage for previous votes
  useEffect(() => {
    const savedStarVote = localStorage.getItem("aurora_star_vote");
    const savedVendorVote = localStorage.getItem("aurora_vendor_vote");
    if (savedStarVote) setVotedStar(savedStarVote);
    if (savedVendorVote) setVotedVendor(savedVendorVote);
  }, []);

  // Subscribe to real-time candidate updates
  useEffect(() => {
    const unsubStar = subscribeToCandidates("star", setStarCandidates);
    const unsubVendor = subscribeToCandidates("vendor", setVendorCandidates);

    return () => {
      unsubStar();
      unsubVendor();
    };
  }, []);

  const handleStarVote = async (candidateId: string) => {
    setIsVotingStar(true);
    const success = await castVote(candidateId);
    
    if (success) {
      setVotedStar(candidateId);
      localStorage.setItem("aurora_star_vote", candidateId);
      toast.success("Vote cast successfully! ⭐", {
        description: "Thank you for participating in Star of the Month!",
      });
    } else {
      toast.error("Failed to cast vote. Please try again.");
    }
    
    setIsVotingStar(false);
  };

  const handleVendorVote = async (candidateId: string) => {
    setIsVotingVendor(true);
    const success = await castVote(candidateId);
    
    if (success) {
      setVotedVendor(candidateId);
      localStorage.setItem("aurora_vendor_vote", candidateId);
      toast.success("Vote cast successfully! 🏆", {
        description: "Thank you for participating in Vendor of the Month!",
      });
    } else {
      toast.error("Failed to cast vote. Please try again.");
    }
    
    setIsVotingVendor(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <motion.section 
        className="py-12 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Cast Your <span className="text-gold-gradient">Vote</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Recognize excellence in our community. Vote for your Star of the Month 
          and Vendor of the Month to celebrate outstanding achievements.
        </motion.p>
      </motion.section>

      {/* Voting Categories */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <VotingCard
              title="Star of the Month"
              subtitle="Celebrate outstanding team members"
              icon="star"
              candidates={starCandidates}
              onVote={handleStarVote}
              isVoting={isVotingStar}
              votedFor={votedStar}
            />

            <VotingCard
              title="Vendor of the Month"
              subtitle="Recognize our best partners"
              icon="trophy"
              candidates={vendorCandidates}
              onVote={handleVendorVote}
              isVoting={isVotingVendor}
              votedFor={votedVendor}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="py-8 border-t border-border/50 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-sm text-muted-foreground">
          © 2024 <span className="text-gold font-medium">Aurora Events</span>. 
          All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
