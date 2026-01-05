import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Candidate } from "@/lib/firebase";

interface WinnerCardProps {
  title: string;
  icon: "star" | "trophy";
  winner: Candidate | null;
}

const WinnerCard = ({ title, icon, winner }: WinnerCardProps) => {
  const IconComponent = icon === "star" ? Star : Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-gold/30 overflow-hidden shadow-gold">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold/20 to-gold-light/20 p-6 border-b border-gold/20">
          <div className="flex items-center justify-center gap-3">
            <IconComponent className="w-8 h-8 text-gold" fill="currentColor" />
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gold">
              {title}
            </h3>
            <IconComponent className="w-8 h-8 text-gold" fill="currentColor" />
          </div>
          <p className="text-center text-muted-foreground mt-2">Winner</p>
        </div>

        <CardContent className="p-8">
          {winner ? (
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Winner Image */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
                <img
                  src={winner.image}
                  alt={winner.name}
                  className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-gold shadow-gold"
                />
                <div className="absolute -bottom-2 -right-2 bg-gold rounded-full p-2">
                  <Trophy className="w-6 h-6 text-background" />
                </div>
              </div>

              {/* Winner Name */}
              <h4 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                {winner.name}
              </h4>

              {/* Vote Count */}
              <p className="text-lg text-gold font-medium">
                🎉 {winner.votes} votes
              </p>

              {/* Congratulations Message */}
              <motion.p 
                className="mt-4 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Congratulations on this well-deserved recognition!
              </motion.p>
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No winner data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WinnerCard;
