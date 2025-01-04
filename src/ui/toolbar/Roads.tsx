import React from 'react';
import { motion } from 'motion/react';
import {
  BsSignTurnRight,
  BsSignIntersectionT,
  BsSignIntersection,
  BsSignStop,
} from "react-icons/bs";
import { FaRoad } from "react-icons/fa";
import ToolbarIcon, { ToolbarIconProps } from './ToolbarIcon.tsx';

const tools: Array<ToolbarIconProps> = [
  {
    action: 'road_straight',
    icon: <FaRoad />
  },
  {
    action: 'road_t',
    icon: <BsSignIntersectionT />
  },
  {
    action: 'road_cross',
    icon: <BsSignIntersection />
  },
  {
    action: 'road_corner',
    icon: <BsSignTurnRight />
  },
  {
    action: 'road_end',
    icon: <BsSignStop  />
  },
];

type Props = {
  activeAction: string | null;
  onAction: (actions: string) => void;
}

function Roads(props: Props) {
  return (
    <motion.div
      key="toolbar-road"
      className="toolbar-tools"
      layout
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
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

export default Roads;
