import './UbuntuFetch.css'

const LOGO_LINES = [
  ['           .-/+oossssoo+/-.'],
  ['       `:+ssssssssssssssssss+:`'],
  ['     -+ssssssssssssssssssyyssss+-'],
  ['   .ossssssssssssssssss', 'dMMMNy', 'sssso.'],
  ['  /ssssssssssshdmmNNmmy', 'NMMMMh', 'ssssss/'],
  [' +ssssssssshmy', 'dMMMMMMMN', 'ddddyssssssss+'],
  ['/ssssssssh', 'NMMMyhhyyyyhmNMMMNh', 'ssssssss/'],
  ['.ssssssss', 'dMMMNh', 'ssssssssssh', 'NMMMd', 'ssssssss.'],
  ['+sssshhhy', 'NMMNy', 'ssssssssssssy', 'NMMMy', 'sssssss+'],
  ['ossy', 'NMMMNyMMh', 'sssssssssssssshmmmhssssssso'],
  ['ossy', 'NMMMNyMMh', 'sssssssssssssshmmmhssssssso'],
  ['+sssshhhy', 'NMMNy', 'ssssssssssssy', 'NMMMy', 'sssssss+'],
  ['.ssssssss', 'dMMMNh', 'ssssssssssh', 'NMMMd', 'ssssssss.'],
  ['/ssssssssh', 'NMMMyhhyyyyhdNMMMNh', 'ssssssss/'],
  [' +sssssssss', 'dmydMMMMMMMM', 'ddddyssssssss+'],
  ['  /ssssssssssshdmNNNNmy', 'NMMMMh', 'ssssss/'],
  ['   .ossssssssssssssssss', 'dMMMNy', 'sssso.'],
  ['     -+ssssssssssssssssssyyyssss+-'],
  ['       `:+ssssssssssssssssss+:`'],
  ['           .-/+oossssoo+/-.'],
]

const PALETTE = [
  { name: 'Purple', colour: '#732181' },
  { name: 'Grey', colour: '#a7a8aa' },
  { name: 'Blue', colour: '#009abe' },
  { name: 'Green', colour: '#81bc00' },
  { name: 'Orange', colour: '#f38a00' },
  { name: 'Magenta', colour: '#ea1c75' },
]

const DETAILS = [
  ['Style', 'Ubuntu / GNOME'],
  ['Host', 'Sask Polytech Workstation'],
  ['Interface', 'React'],
  ['Shell', 'Website terminal'],
  ['Theme', 'Sask Polytech'],
  ['Editor', 'Emacs — Notes'],
  ['Files', 'Courses'],
  ['Role', 'Instructor'],
  ['Campus', 'Regina'],
]

export default function UbuntuFetch() {
  return (
    <div className="ubuntu-fetch">
      <pre
        className="ubuntu-fetch__logo"
        role="img"
        aria-label="Ubuntu ASCII logo in purple and grey"
      >
        {LOGO_LINES.map((segments, lineIndex) => (
          <span key={lineIndex}>
            {segments.map((text, segmentIndex) => (
              <span
                key={segmentIndex}
                className={
                  segmentIndex % 2 === 0
                    ? 'ubuntu-fetch__purple'
                    : 'ubuntu-fetch__grey'
                }
              >
                {text}
              </span>
            ))}
            {lineIndex < LOGO_LINES.length - 1 ? '\n' : ''}
          </span>
        ))}
      </pre>

      <div className="ubuntu-fetch__info">
        <p className="ubuntu-fetch__user">
          jack@workstation
        </p>

        <p
          className="ubuntu-fetch__divider"
          aria-hidden="true"
        >
          ----------------
        </p>

        <dl className="ubuntu-fetch__details">
          {DETAILS.map(([label, value]) => (
            <div key={label}>
              <dt>{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div
          className="ubuntu-fetch__palette"
          role="img"
          aria-label="Palette: purple, grey, blue, green, orange, magenta"
        >
          {PALETTE.map(swatch => (
            <span
              key={swatch.name}
              title={`${swatch.name}: ${swatch.colour}`}
              style={{ backgroundColor: swatch.colour }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}