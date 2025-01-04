import React from 'react';
import { motion } from 'motion/react';
import {
  GiRoad,
  GiModernCity,
  GiFox,
  GiHammerBreak,
  GiAnticlockwiseRotation,
} from "react-icons/gi";
import ToolbarIcon, { ToolbarIconProps } from './ToolbarIcon.tsx';

const tools: Array<ToolbarIconProps> = [
  {
    action: 'road',
    icon: <GiRoad />
  },
  {
    action: 'city',
    icon: <GiModernCity />
  },
  {
    action: 'fox',
    icon: <GiFox />
  },
  {
    action: 'rotate',
    icon: <GiAnticlockwiseRotation />
  },
  {
    action: 'remove',
    icon: <GiHammerBreak />
  },
];

type Props = {
  activeAction: string | null;
  onAction: (actions: string) => void;
}

function Tools(props: Props) {
  return (
    <motion.div
      key="toolbar-tools"
      className="toolbar-tools"
      layout
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{
        type: 'spring',
        bounce: 0.3,
      }}
    >
      {
        tools.map((iconProps) => (
          <ToolbarIcon
          key={iconProps.action}
          {...iconProps}
          active={props.activeAction === iconProps.action}
          onAction={props.onAction}
          />)
        )
      }
    </motion.div>
  );
}

export default Tools;
