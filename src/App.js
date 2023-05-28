import { useState, useEffect } from 'react';

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
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
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log(currentTitle, value, message);
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

  console.log(previousChats);
  const currentChats = previousChats.filter(
    (previousChats) => previousChats.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChats) => previousChats.title))
  );
  console.log(uniqueTitles);

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitles)}>
              {uniqueTitles}
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
          <p className="info">Chat GPT MAY 17</p>
        </div>
      </section>
    </div>
  );
};

export default App;
