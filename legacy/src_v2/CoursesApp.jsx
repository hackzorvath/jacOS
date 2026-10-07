import FileBrowser from './FileBrowser.jsx'

const COURSES = {
  id: 'courses',
  name: 'Courses',
  type: 'folder',
  children: [
    {
      id: 'comp215',
      name: 'COMP 215',
      description: 'Web App Development 1',
      type: 'folder',
      children: [
        {
          id: 'labs',
          name: 'Labs',
          type: 'folder',
          children: [],
        },
        {
          id: 'assignments',
          name: 'Assignments',
          type: 'folder',
          children: [],
        },
        {
          id: 'demos',
          name: 'Demos',
          type: 'folder',
          children: [],
        },
        {
          id: 'resources',
          name: 'Resources',
          type: 'folder',
          children: [
            {
              id: 'html',
              name: 'HTML Reference',
              type: 'link',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
            },
            {
              id: 'css',
              name: 'CSS Reference',
              type: 'link',
              url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
            },
            {
              id: 'bootstrap',
              name: 'Bootstrap',
              type: 'link',
              url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/',
            },
          ],
        },
      ],
    },
    {
      id: 'capl103',
      name: 'CAPL 103',
      description: 'Professionalism and Ethics',
      type: 'folder',
      children: [],
    },
    {
      id: 'comp214',
      name: 'COMP 214',
      description: 'Project Management',
      type: 'folder',
      children: [],
    },
  ],
}

export default function CoursesApp() {
  return <FileBrowser root={COURSES} />
}