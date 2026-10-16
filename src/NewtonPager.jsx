import './NewtonPager.css'

const SAMPLE_ITEMS = [
    {
        id: 'msg-001',
        source: 'Linux Weekly News',
        title: 'Kernel patch series improves scheduler latency',
        summary:
            'A new patch series aims to reduce latency in certain scheduling scenarios, with promising early benchmarks.',
        time: '08:42',
    },
    {
        id: 'msg-002',
        source: 'GamingOnLinux',
        title: 'New indie strategy game launches on Linux',
        summary:
            'A small studio has released a new strategy title with day-one Linux support and Steam Deck verification.',
        time: '07:15',
    },
    {
        id: 'msg-003',
        source: 'Indie Dev Log',
        title: 'Developer shares postmortem on a solo game jam project',
        summary:
            'The write-up covers scope control, bugs, and lessons learned from shipping under tight constraints.',
        time: 'Yesterday',
    },
]

export default function NewtonPager() {
    return (
        <section className="newton-pager">
            <header className="newton-pager__header">
                <h1>/var/spool/news</h1>
                <p>Queued transmissions for local review.</p>
            </header>

            <div className="newton-pager__status">
                <span>LAST SYNC: 08:42</span>
                <span>{SAMPLE_ITEMS.length.toString().padStart(3, '0')} MSG</span>
            </div>

            <div className="newton-pager__banner">
                RSS FEED ACTIVE
            </div>

            <div className="newton-pager__list">
                {SAMPLE_ITEMS.map((item, index) => (
                    <article key={item.id} className="newton-pager__item">
                        <div className="newton-pager__item-meta">
                            <span>MSG {String(index + 1).padStart(3, '0')}</span>
                            <span>{item.time}</span>
                        </div>

                        <h2>{item.title}</h2>

                        <p className="newton-pager__source">{item.source}</p>

                        <p className="newton-pager__summary">
                            {item.summary}
                        </p>

                        <button
                            type="button"
                            className="newton-pager__button"
                            onClick={() => window.open('#', '_blank')}
                        >
                            Open Link
                        </button>
                    </article>
                ))}
            </div>
        </section>
    )
}