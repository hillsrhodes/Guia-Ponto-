/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';

export function ParallaxBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 500], [0.6, 0.2]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating glowing gradient blobs */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-[#FE3A18]/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-rose-500/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
    </div>
  );
}
