import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/Header";
import VotingCard from "@/components/VotingCard";
import FirebaseSetup from "@/components/FirebaseSetup";
import { 
  isFirebaseConfigured, 
  castVote, 
  subscribeToVotes,
  VoteData 
} from "@/lib/firebase";

// Demo candidates data
const starCandidates = [
  { id: "star1", name: "Sarah Mitchell", description: "Outstanding team leadership" },
  { id: "star2", name: "James Rodriguez", description: "Exceptional client relations" },
  { id: "star3", name: "Emily Chen", description: "Innovation in project delivery" },
];

const vendorCandidates = [
  { id: "vendor1", name: "Stellar Catering Co.", description: "Premium event cuisine" },
  { id: "vendor2", name: "Aurora Decor Studio", description: "Stunning visual designs" },
  { id: "vendor3", name: "Harmony Sound Systems", description: "Professional audio excellence" },
];

const Index = () => {
  const [isFirebaseConnected] = useState(isFirebaseConfigured());
  const [starVotes, setStarVotes] = useState<VoteData>({});
  const [vendorVotes, setVendorVotes] = useState<VoteData>({});
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

  // Subscribe to real-time vote updates
  useEffect(() => {
    if (!isFirebaseConnected) return;

    const unsubStar = subscribeToVotes("star_of_month", setStarVotes);
    const unsubVendor = subscribeToVotes("vendor_of_month", setVendorVotes);

    return () => {
      unsubStar();
      unsubVendor();
    };
  }, [isFirebaseConnected]);

  const handleStarVote = async (candidateId: string) => {
    if (!isFirebaseConnected) {
      toast.error("Firebase not connected. Please configure your Firebase credentials.");
      return;
    }

    setIsVotingStar(true);
    const success = await castVote("star_of_month", candidateId);
    
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
    if (!isFirebaseConnected) {
      toast.error("Firebase not connected. Please configure your Firebase credentials.");
      return;
    }

    setIsVotingVendor(true);
    const success = await castVote("vendor_of_month", candidateId);
    
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

  // Merge votes with candidates
  const starWithVotes = starCandidates.map(c => ({
    ...c,
    votes: starVotes[c.id] || 0
  }));

  const vendorWithVotes = vendorCandidates.map(c => ({
    ...c,
    votes: vendorVotes[c.id] || 0
  }));

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

      {/* Firebase Setup Notice */}
      {!isFirebaseConnected && (
        <section className="px-4 mb-12">
          <FirebaseSetup />
        </section>
      )}

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
              candidates={starWithVotes}
              onVote={handleStarVote}
              isVoting={isVotingStar}
              votedFor={votedStar}
              isFirebaseConnected={isFirebaseConnected}
            />

            <VotingCard
              title="Vendor of the Month"
              subtitle="Recognize our best partners"
              icon="trophy"
              candidates={vendorWithVotes}
              onVote={handleVendorVote}
              isVoting={isVotingVendor}
              votedFor={votedVendor}
              isFirebaseConnected={isFirebaseConnected}
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
