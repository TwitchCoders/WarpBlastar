class Greeter {
  element: HTMLElement;
  span: HTMLElement;
  timeToken: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.innerHTML += "The time is: ";

  }
}
