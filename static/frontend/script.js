
class Menu extends React.Component{
    render(props){
        return (
            <div className="nav-container">
                <div id="nav-heading">Neural Wirer</div>
                <div id="nav-username">{this.props.username}</div>
            </div>
        )
    }
}


class App extends React.Component {
    
    constructor(props){
        super(props)
        this.state = { user : 0}
        this.getLogedin()
    }

    getLogedin = () => {
        fetch("/api/user")
        .then(response => response.json())
        .then(user => {
            this.setState({
                ...this.state,
                user:user
            })
        });
    }

    render() {
        return (
        <div>
            <Menu username={this.state.user.username}/>
            Hello World
        </div>
        
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))