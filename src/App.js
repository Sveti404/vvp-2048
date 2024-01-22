import './App.css';
import Grid from './components/Grid';
import { useState, useEffect } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faX } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from "react-responsive";
import { useSwipeable } from "react-swipeable";

import img4_theme_0 from './images/theme-0/4.png';
import img8_theme_0 from './images/theme-0/8.png';
import img16_theme_0 from './images/theme-0/16.png';
import img32_theme_0 from './images/theme-0/32.png';
import img64_theme_0 from './images/theme-0/64.png';
import img128_theme_0 from './images/theme-0/128.png';
import img256_theme_0 from './images/theme-0/256.png';
import img512_theme_0 from './images/theme-0/512.png';
import img1024_theme_0 from './images/theme-0/1024.png';
import img2048_theme_0 from './images/theme-0/2048.png';
import img4096_theme_0 from './images/theme-0/4096.png';


const preloadImgList = [
	img4_theme_0,
	img8_theme_0,
	img16_theme_0,
	img32_theme_0,
	img64_theme_0,
	img128_theme_0,
	img256_theme_0,
	img512_theme_0,
	img1024_theme_0,
	img2048_theme_0,
	img4096_theme_0
]


function Cells({ size }) {
	let result = [];
	for (let i = 0; i < size * size; i++) {
		result.push(<div key={i} className='cell'></div>);
	}
	return result
}

const Themes = ['Teema 1']

function ThemeList(props) {
	let result = [];
	for (let i = 0; i < Themes.length; i++) {
		result.push(<div className={'theme ' + ((props.currentTheme === i) ? 'active' : null)} onClick={() => props.setTheme(i)}>{Themes[i]}</div>)
	}
	return result;
}


function preloadImage (src) {
	return new Promise((resolve, reject) => {
	  const img = new Image()
	  img.onload = function() {
		resolve(img)
	  }
	  img.onerror = img.onabort = function() {
		reject(src)
	  }
	  img.src = src
	})
}

function App() {
	const [score, setScore] = useState(0);
	const [loading, setLoading] = useState(false);
	const [bestScore, setBestScore] = useState(0);
	const [currentHighestScore, setCurrentHighestScore] = useState(false);
	const [restart, setRestart] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [won, setWon] = useState(false);
	const [continueAfterWin, setContinueAfterWin] = useState(false);

	const [settings, setSettings] = useState(false);
	const [theme, setTheme] = useState(0);
	const [swipeEvent, setSwipeEvent] = useState(null);

	const handlers = useSwipeable({
		onSwiped: (eventData) => {
			if (!loading) {
				setSwipeEvent({ key: eventData.dir });
			}

		},
		preventScrollOnSwipe: true,
	});

	const isWideScreen = useMediaQuery({ minWidth: 512 });

	useEffect(() => {
		let isCancelled = false;
	
		async function effect() {
		  if (isCancelled) {
			return
		  }
	
		  const imagePromiseList = [];
		  for (const i of preloadImgList) {
			imagePromiseList.push(preloadImage(i))
		  }
	  
		  await Promise.all(imagePromiseList)
	
		  if (isCancelled) {
			return
		  }
	
		  setLoading(false);
		}
	
		effect()
	
		return () => {
		  isCancelled = true
		}
	}, [])

	useEffect(() => {
		let storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			setTheme(storedTheme);
		}
	}, [])

	useEffect(() => {
		let storedBestScore = localStorage.getItem('bestScore');
		if (storedBestScore) {
			setBestScore(storedBestScore);
		} else {
			localStorage.setItem('bestScore', 0);
		}
	}, [score])

	useEffect(() => {
		if (bestScore > 0 && score >= bestScore && !currentHighestScore) {
			setCurrentHighestScore(true)
		}
		if (gameOver) {
			if (score > bestScore) {
				setBestScore(score);
				localStorage.setItem('bestScore', score);
			}
		}
	}, [gameOver, score, bestScore, currentHighestScore])

	return (
		<>
			<div className='loading-page' style={{display: (!loading) ? 'none' : null}}>
				<MoonLoader
					color={'#1e1e1f'}
					loading={loading}
					size={75}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
				<h1>Ladataan...</h1>
			</div>
			{(!loading) ?
				<div className='page'>


					<div className={'darker-background ' + ((settings) ? 'animate-settings' : '')}></div>

					<div className='settings' style={{ display: (settings) ? 'flex' : 'none' }}>
						<h4 style={{ marginBottom: '0px', marginTop: '7.5px' }}>Asetukset</h4>
						<FontAwesomeIcon icon={faX} className='settings-icon' style={{ position: 'absolute', right: '20px' }} onClick={() => {
							setSettings(!settings);

						}}></FontAwesomeIcon>
						<h4 style={{ borderBottom: '1px solid black', marginTop: '20px', marginBottom: '15px' }}>Teema <span style={{ color: 'blueviolet' }}>(Lisää tulossa)</span></h4>
						<div className='theme-container'>
							<ThemeList currentTheme={theme} setTheme={setTheme}></ThemeList>
						</div>
						<p style={{ marginTop: 'auto', color: 'GrayText', textAlign: 'center', fontSize: '13px', marginBottom: '-10px' }}>Tekijä: Veeti Nerg</p>
					</div>
					<div className={'game-over ' + ((gameOver) ? 'animate' : '')} style={{ color: 'white' }}>
						<h1>Hävisit pelin</h1>
						<p>Pisteitä saatu: {score}</p>
						<button onClick={() => {
							if (score >= bestScore) {
								setBestScore(score);
								localStorage.setItem('bestScore', score);
							}
							setGameOver(false);
							setScore(0);
							setRestart(!restart);
							setCurrentHighestScore(false);

						}} className='start-button'>Yritä uudelleen</button>
					</div>
					<div className={'game-over ' + ((won) ? 'animate' : '')} style={{ color: 'white' }}>
						<h1>Voitit pelin!</h1>
						<p>Pisteitä saatu: {score}</p>
						<span className='win-buttons'>
							<button onClick={() => {

								setWon(false);
								setContinueAfterWin(true);
							}} className='start-button'>Jatka pelaamista</button>
							<button onClick={() => {
								if (score >= bestScore) {
									setBestScore(score);
									localStorage.setItem('bestScore', score);
								}
								setWon(false);
								setScore(0);
								setRestart(!restart);
								setCurrentHighestScore(false);
							}} className='start-button'>Aloita uusi peli</button>
						</span>

					</div>
					<div className='above-container'>
						<div className='above-left'>
							<span style={{ width: '100%' }}>Oispa pääsky</span>
							<span style={{ fontSize: '20px', marginTop: '30px' }}>Yhdistä <strong>johtajia</strong> voittaaksesi pelin</span>
						</div>
						<div className='above-right'>
							<div className='scores'>
								<div className='score-container' style={{ boxShadow: (currentHighestScore) ? '0 0 15px 4px #d6b034' : null }}>PISTEITÄ <br></br>{score}</div>
								<div className='score-container'>PARAS <br></br>{bestScore}</div>
							</div>

							<button onClick={() => {
								if (score >= bestScore) {
									setBestScore(score);
									localStorage.setItem('bestScore', score);
								}
								setScore(0);
								setRestart(!restart);
								setCurrentHighestScore(false);
							}} className='restart-button' style={{ order: 3 }}>Uusi peli</button>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: (isWideScreen) ? 'row' : 'column', gap: '10px' }}>
						<div {...handlers} className='game-container'>
							<div className='grid-container'>
								<Cells size={4} />

							</div>
							<div className='tile-container'>
								<Grid setScore={setScore} score={score} restart={restart} setGameOver={setGameOver} setWon={setWon} continueAfterWin={continueAfterWin} theme={theme} swipeEvent={swipeEvent} />
							</div>
						</div>
						<div className='right-container'>
							<FontAwesomeIcon icon={faGear} size={(isWideScreen) ? '2x' : 'lg'} className='settings-icon' onClick={() => setSettings(!settings)}></FontAwesomeIcon>
						</div>
					</div>


				</div>
			: null}


		</>
	);
}

export default App;
