export function placeGamesMenu(anchor, viewport, menuHeight) {
    const gutter = 12
    const width = Math.min(320, Math.max(0, viewport.width - gutter * 2))
    const left = Math.max(gutter, Math.min(anchor.right + 14, viewport.width - width - gutter))
    const safeTop = viewport.height > 160 ? 44 : gutter
    const top = Math.max(safeTop, Math.min(anchor.top - 4, viewport.height - menuHeight - gutter))
    return { left, top, width, maxHeight: Math.max(0, viewport.height - top - gutter) }
}
