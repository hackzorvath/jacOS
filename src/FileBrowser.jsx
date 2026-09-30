import { useState } from 'react'
import { useSystemError } from './SystemError.jsx'
import './FileBrowser.css'

export default function FileBrowser({
  root,
  singleClickOpen = false,
}) {
  const { showSystemError } = useSystemError()

  const [navigation, setNavigation] = useState({
    path: [],
    history: [],
  })

  const [selectedId, setSelectedId] = useState(null)

  const folders = [root]

  for (const id of navigation.path) {
    const parent = folders[folders.length - 1]

    const child = parent.children?.find(
      item =>
        item.id === id &&
        item.type === 'folder',
    )

    if (!child) break

    folders.push(child)
  }

  const currentFolder =
    folders[folders.length - 1]

  const items =
    currentFolder.children ?? []

  const selectedItem =
    items.find(
      item => item.id === selectedId
    )

  function navigateTo(path) {
    if (
      path.length === navigation.path.length &&
      path.every(
        (id, index) =>
          id === navigation.path[index]
      )
    ) {
      return
    }

    setNavigation(previous => ({
      path,
      history: [
        ...previous.history,
        previous.path,
      ],
    }))

    setSelectedId(null)
  }

  function goBack() {
    setNavigation(previous => {
      if (
        previous.history.length === 0
      ) {
        return previous
      }

      return {
        path:
          previous.history[
            previous.history.length - 1
          ],

        history:
          previous.history.slice(0, -1),
      }
    })

    setSelectedId(null)
  }

  function openItem(item) {
    /*
     * Restricted items use the global
     * Windows XP error.
     */
    if (item.restricted) {
      showSystemError()
      return
    }

    /*
     * Some filesystem items perform a
     * custom action instead of opening
     * normally.
     *
     * mirrors uses this.
     */
    if (item.onOpen) {
      item.onOpen()
      return
    }

    /*
     * Normal folders navigate inside
     * the file browser.
     */
    if (item.type === 'folder') {
      navigateTo([
        ...navigation.path,
        item.id,
      ])

      return
    }

    /*
     * Ordinary files currently have no
     * default action.
     */
    if (item.type === 'file') {
      return
    }

    /*
     * Link-style items open externally.
     */
    if (item.url) {
      window.open(
        item.url,
        '_blank',
        'noopener,noreferrer',
      )
    }
  }

  function getIconClass(item) {
    if (item.icon) {
      return 'file-browser__icon--custom'
    }

    if (item.type === 'folder') {
      return 'file-browser__icon--folder'
    }

    if (item.type === 'file') {
      return 'file-browser__icon--file'
    }

    return 'file-browser__icon--link'
  }

  function getIconContent(item) {
    if (item.icon) {
      return item.icon
    }

    if (item.type === 'file') {
      return '▤'
    }

    if (item.type !== 'folder') {
      return '↗'
    }

    /*
     * Normal folders are drawn by CSS,
     * so they don't need text content.
     */
    return ''
  }

  return (
    <div className="file-browser">
      <nav
        className="file-browser__toolbar"
        aria-label="Folder navigation"
      >
        <button
          type="button"
          className="file-browser__navigation-button"
          aria-label="Back"
          title="Back"
          disabled={
            navigation.history.length === 0
          }
          onClick={goBack}
        >
          ←
        </button>

        <button
          type="button"
          className="file-browser__navigation-button"
          aria-label="Up one folder"
          title="Up one folder"
          disabled={
            navigation.path.length === 0
          }
          onClick={() => {
            navigateTo(
              navigation.path.slice(0, -1)
            )
          }}
        >
          ↑
        </button>

        <div className="file-browser__breadcrumbs">
          {folders.map(
            (folder, index) => (
              <div
                key={folder.id}
                className="file-browser__breadcrumb"
              >
                {index > 0 && (
                  <span
                    className="file-browser__separator"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}

                <button
                  type="button"
                  aria-current={
                    index ===
                    folders.length - 1
                      ? 'page'
                      : undefined
                  }
                  onClick={() => {
                    navigateTo(
                      navigation.path.slice(
                        0,
                        index,
                      )
                    )
                  }}
                >
                  {folder.name}
                </button>
              </div>
            )
          )}
        </div>
      </nav>

      <div
        className="file-browser__content"
        onClick={event => {
          if (
            !event.target.closest(
              '.file-browser__item'
            )
          ) {
            setSelectedId(null)
          }
        }}
      >
        {items.length > 0 ? (
          <ul
            className="file-browser__grid"
            aria-label={
              `${currentFolder.name} contents`
            }
          >
            {items.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  className={[
                    'file-browser__item',

                    selectedId === item.id
                      ? 'is-selected'
                      : '',

                    item.className ?? '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={
                    selectedId === item.id
                  }
                  aria-label={
                    item.type === 'folder'
                      ? `${item.name}, folder`
                      : item.type === 'file'
                        ? `${item.name}, file`
                        : `${item.name}, opens in a new tab`
                  }
                  title={
                    item.description ??
                    (
                      item.type === 'folder'
                        ? 'Folder'
                        : item.type === 'file'
                          ? 'File'
                          : 'Opens in a new tab'
                    )
                  }
                  onClick={() => {
                    setSelectedId(item.id)

                    if (singleClickOpen) {
                      openItem(item)
                    }
                  }}
                  onDoubleClick={() => {
                    if (!singleClickOpen) {
                      openItem(item)
                    }
                  }}
                  onKeyDown={event => {
                    if (
                      event.key === 'Enter'
                    ) {
                      event.preventDefault()

                      if (!event.repeat) {
                        openItem(item)
                      }
                    }
                  }}
                >
                  <span
                    className={[
                      'file-browser__icon',
                      getIconClass(item),
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {getIconContent(item)}
                  </span>

                  <span className="file-browser__name">
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="file-browser__empty">
            This folder is empty
          </div>
        )}
      </div>

      <footer
        className="file-browser__status"
        aria-live="polite"
      >
        <span>
          {items.length}{' '}
          {items.length === 1
            ? 'item'
            : 'items'}
        </span>

        {selectedItem && (
          <span className="file-browser__selection">
            “{selectedItem.name}” selected
          </span>
        )}
      </footer>
    </div>
  )
}