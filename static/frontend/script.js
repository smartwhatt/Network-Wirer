const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;



class App extends React.Component{
    render(){
        return(
        <ReactRouterDOM.HashRouter>
          <Route path="/" exact component={Home} />
          <Route path="/signin" exact component={Signin} />
          {/* <Route path="/login" component={Login} />
          <Route path="/register" component={Register} /> */}
        </ReactRouterDOM.HashRouter>
        )    
    }
}

class Menu extends React.Component{
    
    renderLogedin = () => {
        if (this.props.login)
        return <div id="menu-username">{this.props.username}</div>
        else (this.props.login)
        return <div id="menu-username"><Link to="/signin">Sign in</Link></div>
    }

    render(){
        return (
            <div className="menu-container">
                <div id="menu-heading"><Link to="/">Neural Wirer</Link></div>
                {this.renderLogedin()}
            </div>
        )
    }
}

class SidebarButton extends React.Component{
    render (){
        return (
            <div className="sidebar-button"><Link to={this.props.url}>{this.props.name}</Link></div>
        )
    }
}


class Sidebar extends React.Component{
    render(){
        return (
            <div className="sidebar-container">
                <SidebarButton name="Home" url=""/>
            </div>
        )
    }
}


class Base extends React.Component {
    
    constructor(props){
        super(props)
        this.state = { user : 0, login: false}
        this.getLogedin()
    }
    
    getLogedin = () => {
        fetch("/api/user")
        .then(response => response.json())
        .then(user => {
            if (user.message !== "User is not logged")
            this.setState({
                ...this.state,
                user:user,
                login : true

            })
        });
    }
    renderMenu = () => {
        return ( 
        <div>
            <Menu username={this.state.user.username} login={this.state.login}/>
            <Sidebar />
        </div>
        
        )
    }
}

class Home extends Base {
    render() {
        return (
        <div>
            {this.renderMenu()}
            <div className="content-container">Hello World</div>
        </div>
        )
    }
}

class Signin extends Base {
    constructor(props){
        super(props)
        this.state = { ...this.state, signup:true}
        this.changeState = this.changeState.bind(this)
    }

    renderForm(){
        if (this.state.signup)
        return <span>Sign up</span>
        else
        return <span>Sign in</span>
    }

    changeState() {
        this.setState(prevState => ({
                ...this.state,
                signup:!prevState.signup
            })
        )
    }

    render() {
        return (
        <div>
            {this.renderMenu()}
            <div className="content-container">
            {this.renderForm()}
            <button onClick={this.changeState}>Click</button>
            </div>
        </div>
        )
    }

}

ReactDOM.render(<App />, document.getElementById("app"))