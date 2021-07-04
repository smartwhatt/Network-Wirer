
class Menu extends React.Component{
    render(){
        return (
            <div className="menu-container">
                <div id="menu-heading">Neural Wirer</div>
                <div id="menu-username">{this.props.username}</div>
            </div>
        )
    }
}

class Sidebar extends React.Component{
    render(){
        return (
            <div className="sidebar-container">
                sidebar desu
            </div>
        )
    }
}


class App extends React.Component {
    
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

    render() {
        return (
        <div>
            <Menu username={this.state.user.username}/>
            <Sidebar />
            <div className="content-container">Hello World</div>
        </div>
        
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))