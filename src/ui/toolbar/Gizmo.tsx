import React from 'react';
import { motion } from 'motion/react';
import {
  GiMove,
  GiClockwiseRotation,
  GiExpand,
} from "react-icons/gi";
import ToolbarIcon, { ToolbarIconProps } from './ToolbarIcon.tsx';

const tools: Array<ToolbarIconProps> = [
  {
    action: 'move',
    icon: <GiMove />
  },
  {
    action: 'rotate',
    icon: <GiClockwiseRotation />
  },
  {
    action: 'scale',
    icon: <GiExpand />
  },
];

type Props = {
  activeAction: string | null;
  onAction: (actions: string) => void;
}

function Gizmo(props: Props) {
  return (
    <motion.div
      key="toolbar-gizmo"
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

export default Gizmo;
