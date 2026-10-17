// One data source for both desktop jacOS and Newton.
// The Trivia API is free for noncommercial use under CC BY-NC 4.0.
// https://the-trivia-api.com/docs/

const ENDPOINT = 'https://the-trivia-api.com/v2/questions'

export const CATEGORIES = [
    { id: 'history', label: 'HISTORY' },
    { id: 'science', label: 'SCIENCE' },
    { id: 'geography', label: 'GEOGRAPHY' },
    { id: 'arts_and_literature', label: 'ARTS & BOOKS' },
    { id: 'film_and_tv', label: 'FILM & TV' },
    { id: 'society_and_culture', label: 'CULTURE' },
]

export const VALUES = [100, 200, 300, 400, 500]
const DIFFICULTIES = ['easy', 'easy', 'medium', 'medium', 'hard']
const RANK = { easy: 0, medium: 1, hard: 2 }

function shuffle(items) {
    const result = [...items]
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

async function loadCategory(category, signal) {
    const url = new URL(ENDPOINT)
    url.searchParams.set('categories', category.id)
    url.searchParams.set('limit', '40')
    url.searchParams.set('contentFilter', 'family')

    const response = await fetch(url, { signal })
    if (!response.ok) {
        throw new Error(`Could not load ${category.label} (${response.status}).`)
    }

    const result = await response.json()
    if (!Array.isArray(result)) {
        throw new Error(`Unexpected trivia response for ${category.label}.`)
    }

    const pool = shuffle(result.filter(item =>
        item.type === 'text_choice' &&
        typeof item.id === 'string' &&
        typeof item.question?.text === 'string' &&
        item.question.text.trim() &&
        typeof item.correctAnswer === 'string' &&
        item.correctAnswer.trim() &&
        item.difficulty in RANK
    ))

    // The API has three difficulty levels; our board has five prices.
    // Prefer exact difficulty, then the closest available alternative.
    const clues = VALUES.map((value, index) => {
        const requested = DIFFICULTIES[index]
        pool.sort((a, b) =>
            Math.abs(RANK[a.difficulty] - RANK[requested]) -
            Math.abs(RANK[b.difficulty] - RANK[requested])
        )
        const question = pool.shift()
        if (!question) {
            throw new Error(`Not enough questions for ${category.label}.`)
        }
        return {
            id: question.id,
            value,
            category: category.label,
            question: question.question.text,
            answer: question.correctAnswer,
            dailyDouble: false,
        }
    })

    return { ...category, clues }
}

export async function loadBoard(signal) {
    const categories = await Promise.all(
        CATEGORIES.map(category => loadCategory(category, signal))
    )

    // Exactly one Daily Double, unknown to the player until selected.
    const categoryIndex = Math.floor(Math.random() * categories.length)
    const clueIndex = Math.floor(Math.random() * VALUES.length)

    return categories.map((category, ci) => ({
        ...category,
        clues: category.clues.map((clue, qi) => ({
            ...clue,
            dailyDouble: ci === categoryIndex && qi === clueIndex,
        })),
    }))
}
