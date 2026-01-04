import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <motion.header 
      className="w-full py-6 px-4 border-b border-border/50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto flex items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-8 h-8 text-gold" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          <span className="text-gold-gradient">Aurora</span>
          <span className="text-foreground ml-2">Events</span>
        </h1>
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-8 h-8 text-gold" />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
