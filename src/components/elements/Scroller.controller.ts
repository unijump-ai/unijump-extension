export class ScrollerController {
  private isBottomScrollPrevented: boolean;

  constructor(private element: HTMLDivElement) {}

  preventScrollToBottom(callback: (scrollElement: HTMLDivElement) => boolean) {
    this.isBottomScrollPrevented = callback(this.element);
  }

  preventScrollToBottomIfNotAtBottom() {
    this.preventScrollToBottom((scrollElement) => {
      return (
        scrollElement?.scrollTop !==
        scrollElement?.scrollHeight - scrollElement?.clientHeight
      );
    });
  }

  scrollTop() {
    this.element.scrollTop = 0;
  }

  scrollBottom() {
    if (this.isBottomScrollPrevented) {
      return;
    }

    this.element.scrollTop = this.element.scrollHeight;
  }
}
