import './Game.css';

import useGame from './hooks/useGame.tsx';
import Toolbar from "./ui/toolbar/Toolbar.tsx";

const Game: React.FC = () => {  
  const gameRef = useGame('canvas-game');

  const handleToolbarAction = (action: string) => {
    if (gameRef.current) {
      const { toolbar } = gameRef.current;
      toolbar.onActionSelect(action);      
    }
  };
  
  const handleToolbarSwitch = () => {
    if (gameRef.current) {
      const { toolbar } = gameRef.current;
      toolbar.onToolbarSwitch();      
    }
  };

  return (
    <div className="page">
      <Toolbar
        id="toolbar-game"
        onAction={handleToolbarAction}
        onSwitch={handleToolbarSwitch}
      />
      <canvas className='absolute top-0 left-0' id='canvas-game'/>
    </div>
  );
};

export default Game;
