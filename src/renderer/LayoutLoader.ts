
export default class LayoutLoader {

    load(
        container: HTMLElement,
        layout: string
    ): void {

        container.innerHTML = layout;
    }
}