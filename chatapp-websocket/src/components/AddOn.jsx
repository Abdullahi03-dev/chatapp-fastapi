import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function AddOn(){
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-[#fbc02d]">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-[#f37925] bg-clip-text text-transparent">
              Real-time Messaging
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Instantly chat with others using WebSockets. Experience seamless,
            real-time communication with zero delays.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
