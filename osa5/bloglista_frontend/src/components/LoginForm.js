

const loginForm = ({ handleLogin, handleUsernameChange, handlePasswordChange, username, password }) => (
  <div>
    <h1>log in to application</h1>
    <form onSubmit={handleLogin}>
      <div>
          username
        <input
          id='username'
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
          password
        <input
          id='password'
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  </div>
)

export default  loginForm