import jammyJellyfish from '../assets/jammy_jellyfish.png'

export default function JammyWallpaper() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${jammyJellyfish})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        />
    )
}