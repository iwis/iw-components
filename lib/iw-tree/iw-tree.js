import { focusNextElementOf } from '../iw-browser.js';
document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('iw-tree__button'))
        toggleTreeNode(target.parentElement);
});
document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (target.classList.contains('iw-tree__node--inner') ||
        target.classList.contains('iw-tree__node--leaf')) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusNextElementOf(target.closest('.iw-tree'), -1);
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusNextElementOf(target.closest('.iw-tree'), 1);
        }
    }
    if (target.classList.contains('iw-tree__node--inner')) {
        if (event.key === 'Enter')
            toggleTreeNode(target);
    }
});
/* Closes the given iw-tree__node--inner node if it is open, and opens it if it is closed. */
function toggleTreeNode(innerNode) {
    const isOpen = innerNode.classList.toggle('iw-tree__node--open');
    innerNode.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
/* Opens all nodes in the given tree. Todo: only to some level. */
export function openAllTreeNodes(tree) {
    for (const innerNode of tree.querySelectorAll('.iw-tree__node--inner')) {
        innerNode.classList.add('iw-tree__node--open');
        innerNode.setAttribute('aria-expanded', 'true');
    }
}
//# sourceMappingURL=iw-tree.js.map