export default class Toolbar {
  action: string | null;

  constructor() {
    this.action = null;
  }
  
  /**
   * public methods
   */
  public onActionSelect = (action: string) => {
    if (this.action === action) {
      this.action = null;
    } else {
      this.action = action;
    }
  };

  public onToolbarSwitch = () => {

    console.log('Toolbar:: Switched');
  };
}
