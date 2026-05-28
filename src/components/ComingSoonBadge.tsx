import { motion } from "framer-motion";

export default function ComingSoonBadge() {
  return (
    <motion.span
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ repeat: Infinity, duration: 1.8 }}
      style={{
        display: "inline-flex",
        padding: "0.2rem 0.55rem",
        borderRadius: 999,
        background: "rgba(200,149,110,0.16)",
        fontSize: 12,
      }}
    >
      Feature in progress
    </motion.span>
  );
}
