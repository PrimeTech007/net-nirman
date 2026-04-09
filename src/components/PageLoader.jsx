import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fast loader — just 0.6s
    const timer = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="page-loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="loader-logo">Net Nirman</div>
          <div className="loader-bar-container">
            <div className="loader-bar" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
