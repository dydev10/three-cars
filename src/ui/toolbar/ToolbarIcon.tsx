import React from 'react';
import { motion } from 'motion/react';

export type ToolbarIconProps = {
  icon: React.ReactNode,
  action: string,
  active?: boolean;
  onAction?: (action: string) => void;
};

function ToolbarIcon({
  icon,
  action = 'noop',
  active = false,
  onAction: onActions = () => {},
}: ToolbarIconProps) {
  const handleClick = (action: string) => {
    onActions(action);
  };

  return (
    <motion.div
      key={action}
      data-active={active}
      className='toolbar-icon'
      initial={{
        // opacity: 0.5
      }}
      transition={{
        type: 'spring',
      }}
      whileHover={{
        scale: 1.1,
      }}
      onClick={() => handleClick(action)}
    >
      {icon}
    </motion.div>
  );
}

export default ToolbarIcon;
