import { useEffect, useState } from 'react'
import './NewtonPager.css'

function formatDate(value, includeTime = false) {
    if (!value) return 'UNKNOWN'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'UNKNOWN'

    return date.toLocaleString(undefined, includeTime
        ? { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
        : { month: 'short', day: 'numeric', year: 'numeric' }
    )
}

export default function NewtonPager() {
    const [articles, setArticles] = useState([])
    const [lastSync, setLastSync] = useState(null)
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        const controller = new AbortController()
        const url = `${import.meta.env.BASE_URL}news.json`

        fetch(url, { signal: controller.signal, cache: 'no-store' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`News unavailable (HTTP ${response.status})`)
                }
                return response.json()
            })
            .then(data => {
                if (!Array.isArray(data.items)) {
                    throw new Error('Invalid news.json: missing items array')
                }

                setArticles(data.items)
                setLastSync(data.updatedAt ?? null)
                setStatus('ready')
            })
            .catch(error => {
                if (error.name === 'AbortError') return
                console.error('Newton Pager:', error)
                setStatus('error')
            })

        return () => controller.abort()
    }, [])

    return (
        <section className="newton-pager">
            <header className="newton-pager__header">
                <h1>/var/spool/news</h1>
                <p>Queued transmissions for local review.</p>
            </header>

            <div className="newton-pager__status">
                <span>LAST SYNC: {formatDate(lastSync, true)}</span>
                <span>{String(articles.length).padStart(3, '0')} MSG</span>
            </div>

            <div className="newton-pager__banner">
                {status === 'loading' ? 'CONNECTING...' :
                    status === 'error' ? 'SIGNAL LOST' :
                        'RSS FEED READY'}
            </div>

            {status === 'loading' && <p>Receiving transmissions...</p>}

            {status === 'error' && (
                <p>Could not load news.json. Check that the collector has generated public/news.json.</p>
            )}

            {status === 'ready' && articles.length === 0 && (
                <p>NO NEW TRANSMISSIONS</p>
            )}

            {status === 'ready' && (
                <div className="newton-pager__list">
                    {articles.map((item, index) => (
                        <article key={item.id} className="newton-pager__item">
                            <div className="newton-pager__item-meta">
                                <span>MSG {String(index + 1).padStart(3, '0')}</span>
                                <span>{formatDate(item.publishedAt)}</span>
                            </div>

                            <h2>{item.title}</h2>
                            <p className="newton-pager__source">{item.source}</p>

                            {item.summary && (
                                <p className="newton-pager__summary">{item.summary}</p>
                            )}

                            <a
                                className="newton-pager__button"
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Link
                            </a>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}
