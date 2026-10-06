import { APPS } from './apps.js'

export default function NewtonLauncher({
    onOpenApp,
    darkMode,
}) {
    function handleApp(app) {
        if (app.type === 'link') {
            window.location.href = app.href
            return
        }

        onOpenApp(app.id)
    }

    function getIcon(app) {
        if (app.id === 'sift') {
            return darkMode
                ? app.darkIconSrc
                : app.lightIconSrc
        }

        return app.iconSrc
    }

    return (
        <section className="newton-launcher">
            <div className="newton-app-grid">

                {APPS.map(app => (
                    <button
                        key={app.id}
                        type="button"
                        className="newton-app-icon"
                        onClick={() => handleApp(app)}
                    >
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
                    </button>
                ))}

            </div>
        </section>
    )
}