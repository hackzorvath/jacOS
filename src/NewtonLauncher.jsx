import { APPS } from './apps.js'

export default function NewtonLauncher({
    onOpenApp,
    darkMode,
}) {
    function getIcon(app) {
        if (app.id === 'sift') {
            return darkMode
                ? app.darkIconSrc
                : app.lightIconSrc
        }

        return app.iconSrc
    }


    function renderContents(app) {
        return (
            <>
                <div className="newton-app-tile">
                    <img
                        src={getIcon(app)}
                        alt=""
                        className={
                            app.id === 'sift' && darkMode
                                ? 'newton-launcher-icon newton-launcher-icon--colour'
                                : 'newton-launcher-icon'
                        }
                    />
                </div>

                <span className="newton-app-label">
                    {app.name}
                </span>
            </>
        )
    }


    return (
        <section className="newton-launcher">
            <div className="newton-app-grid">

                {APPS.map(app => {
                    if (app.type === 'link') {
                        return (
                            <a
                                key={app.id}
                                className="newton-app-icon"
                                href={app.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {renderContents(app)}
                            </a>
                        )
                    }

                    return (
                        <button
                            key={app.id}
                            type="button"
                            className="newton-app-icon"
                            onClick={() => onOpenApp(app.id)}
                        >
                            {renderContents(app)}
                        </button>
                    )
                })}

            </div>
        </section>
    )
}