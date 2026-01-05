import { motion } from "framer-motion";
import { Zap, Shield, Users } from "lucide-react";

export default function AddOn() {
  const features = [
    { icon: Zap, title: "Real-time", desc: "Instant messaging" },
    { icon: Shield, title: "Secure", desc: "End-to-end safe" },
    { icon: Users, title: "Groups", desc: "Room-based chats" },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f37925]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to start chatting?
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Join thousands of users already enjoying seamless real-time communication.
          </p>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="bg-white/20 p-3 sm:p-4 rounded-full mb-2">
                  <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{f.title}</span>
                <span className="text-white/80 text-xs sm:text-sm">{f.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
