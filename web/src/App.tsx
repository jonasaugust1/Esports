import './styles/main.css'
import logo from './assets/Logo.svg'
import { useState, useEffect } from 'react'
import { GameBanner } from './components/GameBanner/GameBanner'
import {Modal} from './components/Modal/Modal'


export interface Game {
  id: string
  title: string
  bannerUrl: string
  _count: {
    ads: number
  }
}

function App() {

  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    fetch('http://localhost:3333/games')
      .then(response => response.json())
      .then(jsonResponse => {
        setGames(jsonResponse)
      })
      .catch(error => console.log(error))
  }, [])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logo} alt="" />

      <h1 className='text-6xl text-white font-black mt-20'>
        Seu <span className='text-transparent bg-nlw-gradient bg-clip-text'>duo</span> está aqui
      </h1>

      <div className='grid grid-cols-6 gap-6 mt-16'>
        {games.map(game => (
          <GameBanner
            key={game.id}
            bannerUrl={game.bannerUrl}
            title={game.title}
            adsCount={game._count.ads}
          />
        ))}

      </div>

      <Modal/>
    </div>

  )
}

export default App
