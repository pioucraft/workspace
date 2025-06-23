// @ts-nocheck
export function getEditableTextWithNewlines(element: HTMLElement): string {
    let text = '';

    for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === 'DIV') {
                text += '\n' + getEditableTextWithNewlines(child as HTMLElement);
            } else {
                text += getEditableTextWithNewlines(child as HTMLElement);
            }
        }
    }
    return text;
}
