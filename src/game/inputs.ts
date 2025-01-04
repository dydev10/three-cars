import { InputMapping } from "../engine/utils/Inputs.ts";

const inputs: Array<InputMapping> = [
  {
    name: 'forward',
    keys: ['KeyW']
  },
  {
    name: 'backward',
    keys: ['KeyS']
  },
  {
    name: 'left',
    keys: ['KeyA']
  },
  {
    name: 'right',
    keys: ['KeyD']
  },
  {
    name: 'jump',
    keys: ['Space']
  },
  {
    name: 'click',
    keys: ['Mouse1']
  },
  {
    name: 'altClick',
    keys: ['Mouse2']
  },
];

export default inputs;
