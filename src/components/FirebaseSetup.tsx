import { motion } from "framer-motion";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const FirebaseSetup = () => {
  return (
    <motion.div
      className="bg-card border border-gold/30 rounded-2xl p-6 shadow-card max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Connect Firebase to Enable Voting
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            To store votes persistently, you need to connect your Firebase project. 
            Add the following environment variables to your project:
          </p>
          
          <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-1 mb-4">
            <p className="text-muted-foreground">VITE_FIREBASE_API_KEY</p>
            <p className="text-muted-foreground">VITE_FIREBASE_AUTH_DOMAIN</p>
            <p className="text-muted-foreground">VITE_FIREBASE_PROJECT_ID</p>
            <p className="text-muted-foreground">VITE_FIREBASE_STORAGE_BUCKET</p>
            <p className="text-muted-foreground">VITE_FIREBASE_MESSAGING_SENDER_ID</p>
            <p className="text-muted-foreground">VITE_FIREBASE_APP_ID</p>
          </div>

          <p className="text-muted-foreground text-sm mb-4">
            <strong>Demo Mode:</strong> You can still explore the interface! Voting is disabled until Firebase is connected.
          </p>

          <Button asChild className="gold-gradient text-primary-foreground hover:opacity-90">
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Open Firebase Console
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FirebaseSetup;
