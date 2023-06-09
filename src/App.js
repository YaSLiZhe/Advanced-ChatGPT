import { useState, useEffect } from 'react';

const App = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();

  const createNewChat = () => {
    setCurrentTitle(null);
    setMessage(null);
    setValue('');
  };

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles);
    setMessage(null);
    setValue('');
  };

  const getMessages = async () => {
    const options = {
      method: 'post',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(
        'http://localhost:8000/completions',
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
      speak(data.choices[0].message.content);
    } catch (error) {
      console.error(error);
    }
  };

  const speak = (text) => {
    if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }

    if (text !== '') {
      utterance.text = text;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      synth.speak(utterance);
    }
  };

  const handleVoiceSelect = (event) => {
    const selectedOption = event.target.value;

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        setSelectedVoice(voices[i]);
        break;
      }
    }
  };

  useEffect(() => {
    const populateVoiceList = () => {
      const availableVoices = synth.getVoices().sort((a, b) => {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();

        if (aName < bName) {
          return -1;
        } else if (aName === bName) {
          return 0;
        } else {
          return 1;
        }
      });

      setVoices(availableVoices);

      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    populateVoiceList();

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoiceList;
    }
  }, []);

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChats = previousChats.filter(
    (previousChats) => previousChats.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChats) => previousChats.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Zhe</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ZheGPT</h1>}
        <ul className="feed">
          {currentChats?.map((chatMessages, index) => (
            <li key={index}>
              <p className="role">{chatMessages.role}</p>
              <p>{chatMessages.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              Send
            </div>
          </div>
          <div className="text-to-speech">
            <form onSubmit={(e) => e.preventDefault()}>
              <input className="txt" value={message?.content || ''} readOnly />
              <select
                onChange={handleVoiceSelect}
                style={{ backgroundColor: '#444654', color: 'white' }}
              >
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {`${voice.name} (${voice.lang})`}
                  </option>
                ))}
              </select>
              <button onClick={() => speak(message?.content)}>Speak</button>
            </form>
          </div>
          <p className="info">Chat GPT MAY 17</p>
        </div>
      </section>
    </div>
  );
};

export default App;
