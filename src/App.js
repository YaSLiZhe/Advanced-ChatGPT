const App = () => {
  return (
    <div className="app">
      <section className="side-bar">
        <button>+ New Chat</button>
        <ul className="history">
          <li>bug</li>
        </ul>
        <nav>
          <p>Made by Zhe</p>
        </nav>
      </section>
      <section className="main">
        <h1>ZheGPT</h1>
        <ul className="feed"></ul>
        <div className="bottom-section">
          <div className="input-container">
            <input />
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
