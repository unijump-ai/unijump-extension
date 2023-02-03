export class ScrollerController {
  constructor(private element: HTMLDivElement) {}

  scrollTop() {
    this.element.scrollTop = 0;
  }

  scrollBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }
}
