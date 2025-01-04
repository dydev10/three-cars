import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  GiPaintBrush
} from "react-icons/gi";
// import Gizmo from './Gizmo';
import Tools from './Tools.tsx';
import Roads from './Roads.tsx';

export type ToolbarProps = {
  id: string;
  onAction: (action: string) => void;
  onSwitch: () => void;
}

function Toolbar(props: ToolbarProps) {
  // const [isGizmo, setIsGizmo] = useState<boolean>(false);
  const [isRoads, setIsRoad] = useState<boolean>(false);
  const [activeAction , setActiveAction] = useState<string | null>(null);

  const handleActionChange = (action: string) => {
    props.onAction(action);
    if (activeAction === action) {
      setActiveAction(null);
    } else {
      setActiveAction(action);
    }
  };

  const handleSwitch = () => {    
    // setIsGizmo((val) => !val);
    setIsRoad((val: boolean) => !val);
  };

  const stopMouseEvent = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className='toolbar-container' onClick={stopMouseEvent} onMouseDown={stopMouseEvent} onMouseUp={stopMouseEvent}>
      <motion.div layout id={props.id} className='toolbar'>
        <AnimatePresence mode='popLayout' initial={false}>
          {
            // isGizmo
            isRoads
              // ? <Gizmo
              //     activeAction={activeAction}
              //     onAction={handleActionChange}
              //   />
              ? <Roads
                  activeAction={activeAction}
                  onAction={handleActionChange}
                />
              : <Tools
                  activeAction={activeAction}
                  onAction={handleActionChange}
                />
          }
        </AnimatePresence>
        <motion.div layout className="toolbar-separator"/>
        <motion.div
          layout
          // data-active={!isGizmo}
          data-active={isRoads}
          className="toolbar-switchers"
        >
          <GiPaintBrush onClick={handleSwitch} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Toolbar;
