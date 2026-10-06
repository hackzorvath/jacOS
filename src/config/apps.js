// src/config/apps.js

export const apps = [
    {
        id: "outlook",
        name: "Outlook",
        type: "link",
        href: "https://outlook.office.com/",
        desktopIcon: "/icons/outlook.png",
        mobileIcon: "/icons/newton/outlook.png",
    },
    {
        id: "notes",
        name: "Notes",
        type: "internal",
        app: "notes",
        desktopIcon: "/icons/emacs.png",
        mobileIcon: "/icons/newton/notes.png",
    },
    {
        id: "terminal",
        name: "Terminal",
        type: "internal",
        app: "terminal",
        desktopIcon: "/icons/terminal.png",
        mobileIcon: "/icons/newton/terminal.png",
    },
    {
        id: "sift",
        name: "Sift",
        type: "link",
        href: "YOUR_SIFT_URL",
        desktopIcon: "/icons/sift.png",

        // HANDS OFF THE JETPACK
        mobileIcon: "/icons/newton/sift-jetpack.png",
    },
];