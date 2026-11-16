/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  onClick: () => void;
}

export function FloatingWhatsAppButton({ onClick }: FloatingWhatsAppButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={onClick}
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FE3A18] hover:bg-[#e33315] text-white shadow-2xl shadow-[#FE3A18]/50 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        title="Fale conosco via WhatsApp"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#FE3A18] animate-ping opacity-30 pointer-events-none" />

        <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          Fale no WhatsApp
        </span>
      </button>
    </motion.div>
  );
}
