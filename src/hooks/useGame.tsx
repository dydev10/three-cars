import { useCallback, useEffect, useRef } from "react";
import Game, { GameContext } from "../engine/Game.ts";

const useGame = (canvasId: string): React.MutableRefObject<GameContext|null> => {
  // const containerRef = useRef<HTMLDivElement>();
  const view = useRef<GameContext|null>(null);

  const initView = useCallback(() => {
    if(!view.current) {
      /**
       * Create Experience instance
       */
      console.log('Game:: Hook initView canvasId ::', canvasId);
      view.current = Game.Instance;

      // global access
      // @ts-expect-error window assignment
      globalThis.game = view.current;
    }
  }, [canvasId]);

  const destroy = () => {
    // globalThis.experience.destroy();
    // globalThis.experience = null;
  };

  useEffect(() => {
    initView();

    return () => {      
      destroy();
    };
  }, [initView]);
  
  return view;
};

export default useGame;
