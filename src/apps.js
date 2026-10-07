import outlookIcon from './assets/newton/outlook.png'
import teamsIcon from './assets/newton/teams.png'
import brightspaceIcon from './assets/newton/brightspace.png'
import notesIcon from './assets/newton/notes.png'
import terminalIcon from './assets/newton/terminal.png'
import githubIcon from './assets/newton/github.png'
import coursesIcon from './assets/newton/courses.png'
import trashIcon from './assets/newton/trash.png'

import newtonJetpack from './assets/newton/newton-jetpack.png'
import siftJetpack from './assets/newton/sift-jetpack.png'

import { EXTERNAL_LINKS } from './system/externalLinks.js'


export const APPS = [
    {
        id: 'outlook',
        name: 'Outlook',
        type: 'link',
        href: EXTERNAL_LINKS.outlook,
        iconSrc: outlookIcon,
    },

    {
        id: 'teams',
        name: 'Teams',
        type: 'link',
        href: EXTERNAL_LINKS.teams,
        iconSrc: teamsIcon,
    },

    {
        id: 'brightspace',
        name: 'Brightspace',
        type: 'link',
        href: EXTERNAL_LINKS.brightspace,
        iconSrc: brightspaceIcon,
    },

    {
        id: 'notes',
        name: 'Notes',
        type: 'internal',
        iconSrc: notesIcon,
    },

    {
        id: 'terminal',
        name: 'Terminal',
        type: 'internal',
        iconSrc: terminalIcon,
    },

    {
        id: 'github',
        name: 'GitHub',
        type: 'link',
        href: EXTERNAL_LINKS.github,
        iconSrc: githubIcon,
    },

    {
        id: 'courses',
        name: 'Courses',
        type: 'internal',
        iconSrc: coursesIcon,
    },

    {
        id: 'trash',
        name: 'Trash',
        type: 'internal',
        iconSrc: trashIcon,
    },

    {
        id: 'sift',
        name: 'Sift',
        type: 'link',
        href: EXTERNAL_LINKS.sift,

        lightIconSrc: newtonJetpack,
        darkIconSrc: siftJetpack,
    },
]