import axios from "axios";
import * as React from 'react';
import './App.css';
import * as session from './session';
import logo from './logo.svg';

export interface AppState {
  login_email: string;
  login_password: string;
  register_email: string;
  register_password: string;
  register_confirm_password: string;
  isRequesting: boolean;
  isLoggedIn: boolean;
  data: App.Item[];
  profileData: App.User[];
  error: string;
}

class App extends React.Component<{}, AppState> {
  public state = {
    login_email: "",
    login_password: "",
    register_email: "",
    register_password: "",
    register_confirm_password: "",
    isRequesting: false,
    isLoggedIn: false,
    data: [],
    profileData: [],
    error: ""
  };

  public componentDidMount() {
    this.setState({ isLoggedIn: session.isSessionValid() });
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Bldg Mgr</h1>
        </header>
        <div className="App-error">{this.state.error}</div>
        {this.state.isLoggedIn ? (
          <div className="App-private">
            <div>
              Server test data:
              <ul>
                {this.state.data.map((item: App.Item, index) => <li key={index}>name: {item.name} / value: {item.value}</li>)}
              </ul>
              Server user data:
              <ul>
                {this.state.profileData.map((user: App.User, index) => <li key={index}>email: {user.email}, hash: {user.hash}, salt: {user.salt}</li>)}
              </ul>
            </div>
            <button disabled={this.state.isRequesting} onClick={this.getTestData}>Get test data</button>
            <button disabled={this.state.isRequesting} onClick={this.getUserData}>Get user data</button>
            <button disabled={this.state.isRequesting} onClick={this.logout}>Log out</button>
          </div>
        ) : (
          <div className="App-user">
            <div className="App-login">
              (try the credentials: testuser@login_email.com / my-login_password)
              <input
                disabled={this.state.isRequesting}
                placeholder="Email"
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ login_email: e.target.value })}
              />
              <input
                disabled={this.state.isRequesting}
                placeholder="Password"
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ login_password: e.target.value })}
              />
              <button disabled={this.state.isRequesting} onClick={this.handleLogin}>Log in</button>
            </div>
            <div className="App-register">
              {this.state.register_password && this.state.register_confirm_password && this.state.register_password !== this.state.register_confirm_password ? "Make sure passwords match!" : ""}
              <input
                disabled={this.state.isRequesting}
                placeholder="Register new Email"
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ register_email: e.target.value })}
              />
              <input
                disabled={this.state.isRequesting}
                placeholder="Set a Password"
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ register_password: e.target.value })}
              />
              <input
                disabled={this.state.isRequesting}
                placeholder="Confirm Password"
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ register_confirm_password: e.target.value })}
              />
              <button disabled={this.state.isRequesting || this.state.register_password !== this.state.register_confirm_password} onClick={this.handleRegister}>Register</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  private handleLogin = async (): Promise<void> => {
    const { login_email, login_password } = this.state;
    try {
      this.setState({ error: "" });
      this.setState({ isRequesting: true });
      const response = await axios.post<{ token: string; expiry: string }>("/api/users/login", { email: login_email, password: login_password });
      const { token, expiry } = response.data;
      session.setSession(token, expiry);
      this.setState({ isLoggedIn: true });
    } catch (error) {
      this.setState({ error: "Something went wrong " + error });
    } finally {
      this.setState({ isRequesting: false });
    }
  };

  private handleRegister = async (): Promise<void> => {
    const { register_email, register_password } = this.state;
    try {
      this.setState({ error: "" });
      this.setState({ isRequesting: true });
      const response = await axios.post<{ token: string; expiry: string }>("/api/users/register", { email: register_email, password: register_password });
      const { token, expiry } = response.data;
      session.setSession(token, expiry);
      this.setState({ isLoggedIn: true });
    } catch (error) {
      this.setState({ error: "Something went wrong" });
    } finally {
      this.setState({ isRequesting: false });
    }
  };

  private logout = (): void => {
    session.clearSession();
    this.setState({ isLoggedIn: false });
  };

  private getTestData = async (): Promise<void> => {
    try {
      this.setState({ error: "" });
      const response = await axios.get<App.Item[]>("/api/items", { headers: session.getAuthHeaders() });
      this.setState({ data: response.data });
    } catch (error) {
      this.setState({ error: "Something went wrong" });
    } finally {
      this.setState({ isRequesting: false });
    }
  }

  private getUserData = async (): Promise<void> => {
    try {
      this.setState({ error: "" });
      const response = await axios.get<App.User[]>("/api/users/profile", { headers: session.getAuthHeaders() });
      console.log(response.data);
      this.setState({ profileData: response.data });
    } catch (error) {
      this.setState({ error: "Something went wrong" });
    } finally {
      this.setState({ isRequesting: false });
    }
  }
}

export default App;
