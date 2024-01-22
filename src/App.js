import './App.css';
import Grid from './components/Grid';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faX } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from "react-responsive";
import { useSwipeable } from "react-swipeable";


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
		result.push(<div className={'theme ' + ((props.currentTheme === i) ? 'active' : null )} onClick={() => props.setTheme(i)}>{Themes[i]}</div>)
	}
	return result;
}




function App() {
	const [score, setScore] = useState(0);
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
			setSwipeEvent({key: eventData.dir});
		},
		preventScrollOnSwipe: true,
	});

	const isWideScreen = useMediaQuery({ minWidth: 512 });
	

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
			<div className='page'>
				<div className={'darker-background ' + ((settings) ? 'animate-settings' : '')}></div>

				<div className='settings' style={{display: (settings) ? 'flex' : 'none'}}>
					<h4 style={{marginBottom: '0px', marginTop: '7.5px'}}>Asetukset</h4>
					<FontAwesomeIcon icon={faX} className='settings-icon' style={{position: 'absolute', right: '20px'}} onClick={() => {
						setSettings(!settings);

					}}></FontAwesomeIcon>
					<h4 style={{borderBottom: '1px solid black', marginTop: '20px', marginBottom: '15px'}}>Teema <span style={{color: 'blueviolet'}}>(Lisää tulossa)</span></h4>
					<div className='theme-container'>
						<ThemeList currentTheme={theme} setTheme={setTheme}></ThemeList>
					</div>
					<p style={{marginTop: 'auto', color: 'GrayText', textAlign: 'center', fontSize: '13px', marginBottom: '-10px'}}>Tekijä: Veeti Nerg</p>
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
							<div className='score-container' style={{boxShadow: (currentHighestScore) ? '0 0 15px 4px #d6b034' : null}}>PISTEITÄ <br></br>{score}</div>
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
				<div style={{display: 'flex', flexDirection: (isWideScreen) ? 'row' : 'column', gap: '10px'}}>
					<div {...handlers} className='game-container'>
						<div className='grid-container'>
							<Cells size={4} />

						</div>
						<div className='tile-container'>
							<Grid setScore={setScore} score={score} restart={restart} setGameOver={setGameOver} setWon={setWon} continueAfterWin={continueAfterWin} theme={theme} swipeEvent={swipeEvent}/>
						</div>
					</div>
					<div className='right-container'>
						<FontAwesomeIcon icon={faGear} size={(isWideScreen) ? '2x' : 'lg'} className='settings-icon' onClick={() => setSettings(!settings)}></FontAwesomeIcon>
					</div>
				</div>


			</div>

		</>
	);
}

export default App;
