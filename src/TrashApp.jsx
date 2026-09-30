import FileBrowser from './FileBrowser.jsx'

const TRASH = {
  id: 'trash',
  name: 'Trash',
  type: 'folder',

  children: [
    {
      id: 'plagiarism-odt',
      name: 'plagiarism.odt',
      description: 'Original location: ~/Documents',
      type: 'file',

      restricted: true,
    },
  ],
}

export default function TrashApp() {
  return <FileBrowser root={TRASH} />
}