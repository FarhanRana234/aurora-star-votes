import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/Header";
import VotingCard from "@/components/VotingCard";
import Countdown from "@/components/Countdown";
import WinnerCard from "@/components/WinnerCard";
import { 
  castVote, 
  removeVote,
  subscribeToCandidates,
  Candidate 
} from "@/lib/firebase";

// Voting period: Jan 10, 2026 1:00 AM to Jan 11, 2026 1:00 AM
const VOTING_START_DATE = new Date("2026-01-10T01:00:00");
const VOTING_END_DATE = new Date("2026-01-11T01:00:00");

const Index = () => {
  const [starCandidates, setStarCandidates] = useState<Candidate[]>([]);
  const [vendorCandidates, setVendorCandidates] = useState<Candidate[]>([]);
  const [isVotingStar, setIsVotingStar] = useState(false);
  const [isVotingVendor, setIsVotingVendor] = useState(false);
  const [votedStar, setVotedStar] = useState<string | null>(null);
  const [votedVendor, setVotedVendor] = useState<string | null>(null);
  const [votingEnded, setVotingEnded] = useState(false);
  const [votingStarted, setVotingStarted] = useState(false);

  // Check voting status
  useEffect(() => {
    const now = new Date();
    if (now >= VOTING_END_DATE) {
      setVotingEnded(true);
      setVotingStarted(true);
    } else if (now >= VOTING_START_DATE) {
      setVotingStarted(true);
    }
  }, []);

  // Check localStorage for previous votes
  useEffect(() => {
    const savedStarVote = localStorage.getItem("aurora_star_vote");
    const savedVendorVote = localStorage.getItem("aurora_vendor_vote");
    if (savedStarVote) setVotedStar(savedStarVote);
    if (savedVendorVote) setVotedVendor(savedVendorVote);
  }, []);

  // Subscribe to real-time candidate updates
  useEffect(() => {
    const unsubStar = subscribeToCandidates("stars", setStarCandidates);
    const unsubVendor = subscribeToCandidates("vendors", setVendorCandidates);

    return () => {
      unsubStar();
      unsubVendor();
    };
  }, []);

  // Calculate winners (candidate with most votes in each category)
  const starWinner = useMemo(() => {
    if (starCandidates.length === 0) return null;
    return starCandidates.reduce((prev, current) => 
      (prev.votes || 0) > (current.votes || 0) ? prev : current
    );
  }, [starCandidates]);

  const vendorWinner = useMemo(() => {
    if (vendorCandidates.length === 0) return null;
    return vendorCandidates.reduce((prev, current) => 
      (prev.votes || 0) > (current.votes || 0) ? prev : current
    );
  }, [vendorCandidates]);

  const handleStarVote = async (candidateId: string) => {
    if (!votingStarted) {
      toast.error("Voting hasn't started yet!");
      return;
    }
    if (votingEnded) {
      toast.error("Voting has ended!");
      return;
    }
    
    setIsVotingStar(true);
    
    // If switching vote, remove previous vote first
    if (votedStar && votedStar !== candidateId) {
      await removeVote(votedStar);
    }
    
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
    if (!votingStarted) {
      toast.error("Voting hasn't started yet!");
      return;
    }
    if (votingEnded) {
      toast.error("Voting has ended!");
      return;
    }
    
    setIsVotingVendor(true);
    
    // If switching vote, remove previous vote first
    if (votedVendor && votedVendor !== candidateId) {
      await removeVote(votedVendor);
    }
    
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

  const handleVotingComplete = () => {
    setVotingEnded(true);
  };

  const handleVotingStart = () => {
    setVotingStarted(true);
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
          {votingEnded ? (
            <>And The <span className="text-gold-gradient">Winners</span> Are...</>
          ) : !votingStarted ? (
            <>Voting <span className="text-gold-gradient">Coming Soon</span></>
          ) : (
            <>Cast Your <span className="text-gold-gradient">Vote</span></>
          )}
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {votingEnded 
            ? "Thank you for participating! Here are the winners of this month's awards."
            : !votingStarted
            ? "The voting period will begin soon. Get ready to recognize excellence in our community!"
            : "Recognize excellence in our community. Vote for your Star of the Month and Vendor of the Month to celebrate outstanding achievements."
          }
        </motion.p>

        {/* Countdown Timer */}
        {!votingStarted ? (
          <Countdown targetDate={VOTING_START_DATE} onComplete={handleVotingStart} />
        ) : (
          <Countdown targetDate={VOTING_END_DATE} onComplete={handleVotingComplete} />
        )}
      </motion.section>

      {/* Voting Categories or Winners */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          {votingEnded ? (
            /* Winners Display */
            <motion.div 
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <WinnerCard
                title="Star of the Month"
                icon="star"
                winner={starWinner}
              />
              <WinnerCard
                title="Vendor of the Month"
                icon="trophy"
                winner={vendorWinner}
              />
            </motion.div>
          ) : (
            /* Voting Cards */
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
          )}
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="py-8 border-t border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          {/* Instagram Link */}
          <a 
            href="https://www.instagram.com/aurora_events_by_f.j/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-gold transition-colors duration-300"
            aria-label="Follow us on Instagram"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </a>
          
          <p className="text-sm text-muted-foreground">
            © 2024 <span className="text-gold font-medium">Aurora Events</span>. 
            All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
