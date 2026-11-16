/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FE3A18] via-rose-500 to-orange-500 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
