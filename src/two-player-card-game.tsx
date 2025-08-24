import React, { useState, useEffect } from 'react';
import { Shuffle, Plus, Trash2, Settings, Play, Users } from 'lucide-react';
import { useEmojiSelector } from './hooks/emoji.hook';
import EmojiSelector from './components/emoji-category.selector';

const TwoPlayerCardGame = () => {
  // Game phases: 'setup', 'ready', 'playing'
  const [gamePhase, setGamePhase] = useState('setup');
  
  // items from emoji ts
  const {
    selectedCategory,
    availableItems,
    selectCategory,
    categories,
  } = useEmojiSelector();


  // All available emoticons for selection
  // const [availableItems] = useState([
  //   '🔨', '🔧', '⚒️', '🪚', '🔩', '⚙️', '🪛', '📏', '📐', '✂️', 
  //   '🖇️', '📎', '🔗', '⛏️', '🪓', '🗜️', '🧰', '🔪', '⚡', '🔌',
  //   '🪜', '🧲', '🪝', '⛓️', '🛠️', '⚗️', '🔬', '🧪', '💡', '🔦',
  //   '📱', '💻', '⌚', '📺', '🎮', '📷', '🎧', '🖥️', '⌨️', '🖱️',
  //   '🎯', '🏀', '⚽', '🎾', '🏈', '🎱', '🎲', '🧩', '🎨', '📚',
  //   '🎪', '🎭', '🏆', '🎖️', '🏅', '🎀', '🎁', '🎉', '🎊', '🎈',
  //   '🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍',
  //   '🥕', '🌽', '🥒', '🍅', '🥑', '🥦', '🧄', '🧅', '🌶️', '🫑',
  //   '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
  //   '✈️', '🛩️', '🚁', '🚂', '🚆', '🚄', '🚅', '🚈', '🚝', '🚞',
  //   '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪',
  //   '⭐', '🌟', '💫', '⚡', '💥', '🔥', '❄️', '💧', '🌈', '☀️',
  //   '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  //   '🌸', '🌺', '🌻', '🌷', '🌹', '🌱', '🌿', '🍀', '🌳', '🌲'
  // ]);

  // Game arrays (selected by referee)
  const [gameToolsArray, setGameToolsArray] = useState<string[]>([]);
  const [gameObjectsArray, setGameObjectsArray] = useState<string[]>([]);
  
  // Dynamic labels for categories
  const [toolsLabel, setToolsLabel] = useState('Tools');
  const [objectsLabel, setObjectsLabel] = useState('Objects');

  // Referee selections
  const [selectedTools, setSelectedTools] = useState(new Set<string>());
  const [selectedObjects, setSelectedObjects] = useState(new Set<string>());

  // Removed player card storage - players just shuffle and pass turn

  // Current displayed cards
  const [currentTool, setCurrentTool] = useState('❓');
  const [currentObject, setCurrentObject] = useState('❓');
  
  // Current player turn (1 or 2) - only for shuffling
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(1);
  
  // Player names
  const [player1Name, setPlayer1Name] = useState<string>('Player 1');
  const [player2Name, setPlayer2Name] = useState<string>('Player 2');
  
  // Referee setup tab
  const [activeTab, setActiveTab] = useState('tools');
  
  // Animation state
  const [isShuffling, setIsShuffling] = useState(false);

  // Load from session storage on mount
  useEffect(() => {
    const savedGameData = sessionStorage.getItem('cardGameData');
    if (savedGameData) {
      const data = JSON.parse(savedGameData);
      setGameToolsArray(data.gameToolsArray || []);
      setGameObjectsArray(data.gameObjectsArray || []);
      setSelectedTools(new Set(data.selectedTools || []));
      setSelectedObjects(new Set(data.selectedObjects || []));
      setGamePhase(data.gamePhase || 'setup');
      setCurrentPlayerTurn(data.currentPlayerTurn || 1);
      setPlayer1Name(data.player1Name || 'Player 1');
      setPlayer2Name(data.player2Name || 'Player 2');
      setToolsLabel(data.toolsLabel || 'Tools');
      setObjectsLabel(data.objectsLabel || 'Objects');
    }
  }, []);

  // Save to session storage whenever game state changes
  useEffect(() => {
    const gameData = {
      gameToolsArray,
      gameObjectsArray,
      selectedTools: Array.from(selectedTools),
      selectedObjects: Array.from(selectedObjects),
      gamePhase,
      currentPlayerTurn,
      player1Name,
      player2Name,
      toolsLabel,
      objectsLabel
    };
    sessionStorage.setItem('cardGameData', JSON.stringify(gameData));
  }, [gameToolsArray, gameObjectsArray, selectedTools, selectedObjects, gamePhase, currentPlayerTurn, player1Name, player2Name, toolsLabel, objectsLabel]);

  // Toggle emoticon selection for referee
  const toggleSelection = (emoticon: string, type: 'tools' | 'objects') => {
    if (type === 'tools') {
      const newSelected = new Set(selectedTools);
      if (newSelected.has(emoticon)) {
        newSelected.delete(emoticon);
      } else {
        newSelected.add(emoticon);
      }
      setSelectedTools(newSelected);
    } else {
      const newSelected = new Set(selectedObjects);
      if (newSelected.has(emoticon)) {
        newSelected.delete(emoticon);
      } else {
        newSelected.add(emoticon);
      }
      setSelectedObjects(newSelected);
    }
  };

  // Start the game with selected emoticons
  const startGame = () => {
    if (selectedTools.size > 0 && selectedObjects.size > 0) {
      const toolsArray = Array.from(selectedTools);
      const objectsArray = Array.from(selectedObjects);
      setGameToolsArray(toolsArray);
      setGameObjectsArray(objectsArray);
      setCurrentTool(toolsArray[0]);
      setCurrentObject(objectsArray[0]);
      setGamePhase('ready');
    }
  };

  // Begin playing phase
  const beginPlaying = () => {
    setGamePhase('playing');
    shuffleCards(); // Initial shuffle
  };

  // Get random item from array
  const getRandomItem = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Shuffle both cards and automatically switch to next player
  const shuffleCards = () => {
    if (gamePhase === 'playing' && gameToolsArray.length > 0 && gameObjectsArray.length > 0) {
      setIsShuffling(true);
      
      // Animation delay
      setTimeout(() => {
        setCurrentTool(getRandomItem(gameToolsArray));
        setCurrentObject(getRandomItem(gameObjectsArray));
        setIsShuffling(false);
        // Automatically switch to next player after shuffle
        setCurrentPlayerTurn(currentPlayerTurn === 1 ? 2 : 1);
      }, 600);
    }
  };

  // Switch to next player turn manually if needed
  const nextPlayerTurn = () => {
    setCurrentPlayerTurn(currentPlayerTurn === 1 ? 2 : 1);
  };

  // Reset entire game
  const resetGame = () => {
    setGamePhase('setup');
    setSelectedTools(new Set());
    setSelectedObjects(new Set());
    setGameToolsArray([]);
    setGameObjectsArray([]);
    setCurrentTool('❓');
    setCurrentObject('❓');
    setCurrentPlayerTurn(1);
    setPlayer1Name('Player 1');
    setPlayer2Name('Player 2');
    setToolsLabel('Tools');
    setObjectsLabel('Objects');
    setActiveTab('tools');
    setIsShuffling(false);
    sessionStorage.removeItem('cardGameData');
  };

  // Referee Setup Phase
  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Settings className="text-gray-600" size={32} />
                <h1 className="text-3xl font-bold text-gray-800">Referee Setup</h1>
              </div>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Category Labels Input */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customize Category Labels</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category 1 Name</label>
                  <input
                    type="text"
                    value={toolsLabel}
                    onChange={(e) => setToolsLabel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Tools, Animals, Foods..."
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category 2 Name</label>
                  <input
                    type="text"
                    value={objectsLabel}
                    onChange={(e) => setObjectsLabel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Objects, Places, Colors..."
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'tools'
                      ? 'bg-white text-orange-600 shadow-md'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  🔧 {toolsLabel} ({selectedTools.size})
                </button>
                <button
                  onClick={() => setActiveTab('objects')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'objects'
                      ? 'bg-white text-green-600 shadow-md'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  📱 {objectsLabel} ({selectedObjects.size})
                </button>
              </div>
            </div>

            {activeTab === 'tools' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Select Tools for the Game
                </h2>
                <EmojiSelector selectCategory={selectCategory} selectedCategory={selectedCategory}  />
                <div className="grid grid-cols-8 gap-3 p-6 bg-orange-50 rounded-lg max-h-96 overflow-y-auto">
                  {availableItems.map((tool, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSelection(tool, 'tools')}
                      className={`text-4xl p-4 rounded-lg transition-all ${
                        selectedTools.has(tool)
                          ? 'bg-orange-500 text-white shadow-lg scale-110 transform'
                          : 'bg-white hover:bg-orange-100 shadow hover:scale-105 transform'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'objects' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Select Objects for the Game
                </h2>
                <EmojiSelector selectCategory={selectCategory} selectedCategory={selectedCategory}  />
                <div className="grid grid-cols-8 gap-3 p-6 bg-green-50 rounded-lg max-h-96 overflow-y-auto">
                  {availableItems.map((object, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSelection(object, 'objects')}
                      className={`text-4xl p-4 rounded-lg transition-all ${
                        selectedObjects.has(object)
                          ? 'bg-green-500 text-white shadow-lg scale-110 transform'
                          : 'bg-white hover:bg-green-100 shadow hover:scale-105 transform'
                      }`}
                    >
                      {object}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button
                onClick={startGame}
                disabled={selectedTools.size === 0 || selectedObjects.size === 0}
                className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-lg"
              >
                <Play size={24} />
                Game is Ready
              </button>
            </div>
            
            {(selectedTools.size === 0 || selectedObjects.size === 0) && (
              <p className="text-gray-600 text-center mt-4">
                Please select at least one {toolsLabel.toLowerCase()} and one {objectsLabel.toLowerCase()} to start the game
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game Ready Phase
  if (gamePhase === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <Users className="mx-auto text-indigo-600 mb-4" size={64} />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Game is Ready!</h1>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Tools ({gameToolsArray.length})</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameToolsArray.map((tool, index) => (
                    <span key={index} className="text-2xl bg-orange-200 rounded-lg p-2">{tool}</span>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Objects ({gameObjectsArray.length})</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameObjectsArray.map((object, index) => (
                    <span key={index} className="text-2xl bg-green-200 rounded-lg p-2">{object}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={beginPlaying}
                className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-3 shadow-lg"
              >
                <Play size={24} />
                Start Playing!
              </button>
              
              <button
                onClick={resetGame}
                className="px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all"
              >
                Back to Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Phase
  const PlayerSection = ({ playerNum, bgGradient, isCurrentTurn, name, setName }: {playerNum: number, bgGradient: string, isCurrentTurn: boolean, name: string, setName: React.Dispatch<React.SetStateAction<string>>}) => (
    <div className="flex justify-center p-8">
      <div className={`${bgGradient} rounded-xl p-6 w-80 shadow-lg transition-all duration-300 ${
        isCurrentTurn ? 'ring-4 ring-yellow-400 shadow-yellow-400/50 shadow-2xl' : ''
      }`}>
        <div className="text-center mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-bold bg-transparent text-white text-center border-b-2 border-white/30 focus:border-white focus:outline-none mb-2 px-2 py-1 w-full"
            placeholder={`Player ${playerNum}`}
            maxLength={20}
          />
          {isCurrentTurn && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-400 text-lg">👑</span>
              <span className="text-yellow-400 font-semibold">Your Turn</span>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-4xl mb-3">
            {isCurrentTurn ? "🎲" : "⏳"}
          </div>
          <p className="text-white/90 text-sm">
            {isCurrentTurn 
              ? "Ready to shuffle!"
              : "Waiting..."
            }
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Game Cards Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white">
              Tools & Objects Card Game
            </h1>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Reset Game
            </button>
          </div>
          
          <div className="flex justify-center gap-8 mb-8">
            {/* Tools Card */}
            <div className={`bg-white rounded-xl shadow-2xl p-8 w-64 h-80 flex flex-col items-center justify-center transition-all duration-300 ${
              isShuffling ? 'animate-pulse scale-105' : ''
            }`}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{toolsLabel}</h3>
              <div className={`text-8xl mb-6 transition-all duration-300 ${
                isShuffling ? 'blur-sm' : ''
              }`}>
                {isShuffling ? '🔄' : currentTool}
              </div>
              <div className="w-full h-1 bg-orange-200 rounded"></div>
            </div>

            {/* Objects Card */}
            <div className={`bg-white rounded-xl shadow-2xl p-8 w-64 h-80 flex flex-col items-center justify-center transition-all duration-300 ${
              isShuffling ? 'animate-pulse scale-105' : ''
            }`}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{objectsLabel}</h3>
              <div className={`text-8xl mb-6 transition-all duration-300 ${
                isShuffling ? 'blur-sm' : ''
              }`}>
                {isShuffling ? '🔄' : currentObject}
              </div>
              <div className="w-full h-1 bg-green-200 rounded"></div>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentPlayerTurn === 1 ? player1Name : player2Name}'s Turn
            </h2>
            <p className="text-white/80">
              {currentPlayerTurn === 1 ? 'Blue Player' : 'Purple Player'} - Shuffle and pass!
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={shuffleCards}
              disabled={isShuffling}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle size={24} className={isShuffling ? 'animate-spin' : ''} />
              {isShuffling ? 'Shuffling...' : `Shuffle & Pass Turn`}
            </button>
            
            <button
              onClick={nextPlayerTurn}
              disabled={isShuffling}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Skip Turn
            </button>
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="bg-gray-100 py-8">
        <div className="flex justify-center gap-12">
          <PlayerSection 
            playerNum={1}
            bgGradient="bg-gradient-to-br from-blue-500 to-blue-700"
            isCurrentTurn={currentPlayerTurn === 1}
            name={player1Name}
            setName={setPlayer1Name}
          />
          <PlayerSection 
            playerNum={2}
            bgGradient="bg-gradient-to-br from-purple-500 to-pink-600"
            isCurrentTurn={currentPlayerTurn === 2}
            name={player2Name}
            setName={setPlayer2Name}
          />
        </div>
      </div>
    </div>
  );
};

export default TwoPlayerCardGame;