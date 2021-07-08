const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Redirect = ReactRouterDOM.Redirect;

function getCookies() {
    var c = document.cookie, v = 0, cookies = {};
    if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
        c = RegExp.$1;
        v = 1;
    }
    if (v === 0) {
        c.split(/[,;]/).map(function(cookie) {
            var parts = cookie.split(/=/, 2),
                name = decodeURIComponent(parts[0].trimLeft()),
                value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
            cookies[name] = value;
        });
    } else {
        c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
            var name = $0,
                value = $1.charAt(0) === '"'
                          ? $1.substr(1, -1).replace(/\\(.)/g, "$1")
                          : $1;
            cookies[name] = value;
        });
    }
    return cookies;
}
function getCookie(name) {
    return getCookies()[name];
}

class App extends React.Component{
    render(){
        return(
        <ReactRouterDOM.HashRouter>
          <Route path="/" exact component={Home} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/dataset" exact component={Datasets} />
          {/* <Route path="/login" component={Login} />
          <Route path="/register" component={Register} /> */}
        </ReactRouterDOM.HashRouter>
        )    
    }
}

class Menu extends React.Component{
    
    renderLogedin = () => {
        if (this.props.login)
        return <div id="menu-username">
            {this.props.username}
            <div className="dropdown-content">
                <Link to="/logout">Logout</Link>
                </div>
            </div>
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
            <div className="sidebar-button">
                <Link to={this.props.url}>{this.props.name}</Link>
            </div>
        )
    }
}


class Sidebar extends React.Component{
    render(){
        return (
            <div className="sidebar-container">
                <SidebarButton name="Home" url="/"/>
                <SidebarButton name="Datasets" url="/dataset"/>
                <SidebarButton name="Models" url="/"/>
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
        <div className="div-container">
            {this.renderMenu()}
            <div className="content-container">Hello World</div>
        </div>
        )
    }
}

class Signin extends Base {
    constructor(props){
        super(props)
        this.state = {
             ...this.state, 
             signup:true,
             redirect:false,
             username:"",
             password:"",
             conf_password:"",
             email:"",
             passAlert:false
            }
        this.changeState = this.changeState.bind(this)
        this.SetSignin = this.SetSignin.bind(this)
        this.SetSignup = this.SetSignup.bind(this)
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.updateEmail = this.updateEmail.bind(this)
        this.updateConPass = this.updateConPass.bind(this)
        this.signIn = this.signIn.bind(this)
        this.signUp = this.signUp.bind(this)
        this.checkAlert = this.checkAlert.bind(this)
        
    }

    renderForm(){
        if (this.state.redirect)
        return <Redirect to="/" />
        if (this.state.signup)
        return (
            <div>
                <div className="selector">
                <div id="signup" onClick={this.SetSignup}>Sign in</div>
                    <div id="signin" onClick={this.SetSignin} >Sign up</div>
                    <hr className="slider" />
                </div>
                <form onSubmit={this.signIn}>
                    <input type="text" placeholder="Username" className="textInput" id="username" autofocus="true" value={this.state.username} onChange={this.updateUsername}></input>
                    <input type="password" placeholder="Password" className="textInput" id="password" value={this.state.password} onChange={this.updatePassword}></input>
                    <input type="submit" className="submitButton" value="Sign in"></input>
                    <div className="submitButton" onClick={this.changeState} >Sign Up?</div>
                </form>
            </div>
            )
        else
        return (
            <div>
                <div className="selector">
                    <div id="signup" onClick={this.SetSignup}>Sign in</div>
                    <div id="signin" onClick={this.SetSignin} className="active">Sign up</div>
                    <hr className="slider" />
                </div>
                <form onSubmit={this.signUp}>
                    <input type="text" placeholder="Username" className="textInput" id="username" autofocus="true" value={this.state.username} onChange={this.updateUsername}></input>
                    <input type="email" placeholder="Email" className="textInput" id="email" value={this.state.email} onChange={this.updateEmail}></input>
                    <input type="password" placeholder="Password" className="textInput" id="password" value={this.state.password} onChange={this.updatePassword}></input>
                    <input type="password" placeholder="Confirm Password" className="textInput" id="password2" value={this.state.conf_password} onChange={this.updateConPass}></input>
                    {this.checkAlert()}
                    <input type="submit" className="submitButton" value="Sign up"></input>
                    <div className="submitButton" onClick={this.changeState} >Sign In?</div>
                </form>
            </div>
            )
    }
    checkAlert(){
        if(this.state.passAlert){
        
        return <span className="error">The passwords you entered do not match</span>
        }
    }

    changeState() {
        this.setState(prevState => ({
                ...this.state,
                signup:!prevState.signup
            })
        )
    }
    SetSignin() {
        this.setState(prevState => ({
                ...this.state,
                signup:false
            })
        )
    }
    SetSignup() {
        this.setState(prevState => ({
                ...this.state,
                signup:true
            })
        )
    }

    updateUsername(event){
        this.setState(prevState => ({
            ...this.state,
            username:event.target.value
        })
    )
    }
    updatePassword(event){
        this.setState(prevState => ({
            ...this.state,
            password:event.target.value
        })
    )
    }
    updateEmail(event){
        this.setState(prevState => ({
            ...this.state,
            email:event.target.value
        })
    )
    }
    updateConPass(event){
        this.setState(prevState => ({
            ...this.state,
            conf_password:event.target.value
        })
    )
    }

    signIn(){
        fetch('/api/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json; charset=UTF-8", 'X-CSRFToken': getCookie('csrftoken') },
        body: JSON.stringify({
            "username": this.state.username,
            "password": this.state.password
        })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            this.setState(prevState => ({
                ...this.state,
                redirect:true
            })
            )
            return false
        });
    }
    signUp(){
        if (this.state.password === this.state.conf_password){
        fetch('/api/register', {
        method: 'POST',
        headers: { "Content-Type": "application/json; charset=UTF-8", 'X-CSRFToken': getCookie('csrftoken') },
        body: JSON.stringify({
            "username": this.state.username,
            "password": this.state.password,
            "email": this.state.email
        })
        })
        .then(response => response.json())
        .then(result => {
            // Print result
            this.setState(prevState => ({
                ...this.state,
                redirect:true
            })
            )
            return false
        });
    }
    else
    {
        this.setState(prevState => ({
            ...this.state,
            passAlert:true
        })
        )
    }
    }

    render() {
        return (
        <div className="div-container">
            {this.renderMenu()}
            <div className="content-container">
                <div className="login-form-container">
                {this.renderForm()}
                </div>
            </div>
        </div>
        )
    }

}

class Logout extends Base {
    constructor(props){
        super(props)
        this.logOut()
    }

    logOut(){
        fetch("/api/logout")
        .then(response => response.json())
        .then(message => {

            
        });
    }

    render() {
        return <Redirect to="/" />
    }
}

class Datasets extends Base {
    constructor(props){
        super(props)
        this.state = {
            ...this.state, 
            all:true,
            query:"",
            loading:false,
            data: null,
            searchResult:false
           }
        this.updateQuery = this.updateQuery.bind(this)
        this.renderDatasetView = this.renderDatasetView.bind(this)
        this.renderDataState = this.renderDataState.bind(this)
        this.SetAll = this.SetAll.bind(this)
        this.SetU = this.SetU.bind(this)
        this.renderDataTable = this.renderDataTable.bind(this)
        this.searchDatasets = this.searchDatasets.bind(this)
    }

    SetAll() {
        this.setState(prevState => ({
                ...this.state,
                all:true,
                data:null,
                searchResult:false
            })
        )
    }
    SetU() {
        this.setState(prevState => ({
                ...this.state,
                all:false,
                data:null,
                searchResult:false
            })
        )
    }

    updateQuery(event){
        this.setState(prevState => ({
            ...this.state,
            query:event.target.value
        })
    )
    }
    renderDataState(){
        if(this.state.login && this.state.all){
            return(
            <div className="dataSelector">
                    <div id="allData" onClick={this.SetAll}>All Dataset</div>
                    <div id="uData" onClick={this.SetU}>Your Dataset</div>
                    <hr className="slider" />
                    
            </div>
            )
        }
        else if(!this.state.all)
        return (
            <div className="dataSelector">
            <div id="allData" onClick={this.SetAll}>All Dataset</div>
            <div id="uData" className="active" onClick={this.SetU}>Your Dataset</div>
            <hr className="slider" />
        </div>
        )
        else 
        return (
        <div className="dataSelector">
            <div id="allData" onClick={this.SetAll}>All Dataset</div>
            <div id="uData" className="inactive">Your Dataset</div>
            <hr className="slider" />
        </div>
        )
    }

    searchDatasets(){
        if(this.state.query !== ""){
            this.setState({ loading: true }, () => {
                fetch(`/api/dataset?query=${this.state.query}`)
                .then(response => response.json())
                .then(message => {
                    console.log(message)
                    this.setState({
                        ...this.state,
                        loading:false,
                        data:message,
                        searchResult:true,
                        query:""
                    })
                    
                });
            });
        }
    }

    renderDataTable(){
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        else if (this.state.all && this.state.data === null && this.state.searchResult===false){
            this.setState({ loading: true }, () => {
                fetch("/api/dataset")
                .then(response => response.json())
                .then(message => {
                    // console.log(message)
                    this.setState({
                        ...this.state,
                        loading:false,
                        data:message,
                        searchDatasets:false
                    })
                    
                });
            });
        }
        else if (!this.state.all && this.state.data === null && this.state.searchResult===false){
            this.setState({ loading: true }, () => {
                fetch("/api/user/dataset")
                .then(response => response.json())
                .then(message => {
                    // console.log(message)
                    this.setState({
                        ...this.state,
                        loading:false,
                        data:message,
                        searchDatasets:false
                    })
                    
                });
            });
        }
        else if (this.state.data !== null && this.state.searchResult===false){
            return (
                <table className="datasetTable">
                    <tr className="topRow">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Owner</th>
                    </tr>
                    {this.state.data.map((dataset, index) =>{
                        // console.log(this.state.data)
                        return(
                            <tr>
                                 <td className="name">{dataset.name}</td> {/* have to be link */}
                                <td className="description">{dataset.description}</td>
                                <td className="owner">{dataset.owner.username}</td>
                            </tr>
                        ) 
                    })}
                </table>
            )
        }
        else if (this.state.data !== null && this.state.searchResult){
            return (
                <table className="datasetTable">
                    <tr className="topRow">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Owner</th>
                    </tr>
                    {this.state.data.map((dataset, index) =>{
                        // console.log(this.state.data)
                        return(
                            <tr>
                                 <td className="name">{dataset.name}</td> {/* have to be link */}
                                <td className="description">{dataset.description}</td>
                                <td className="owner">{dataset.owner.username}</td>
                            </tr>
                        ) 
                    })}
                </table>
            )
        }
    }

    renderDatasetView(){
        return (
            <div class="datasetsView">
                {this.renderDataState()}
                {this.renderDataTable()}
            </div>
        )
    }


    render() {
        return (
            <div className="div-container">
                {this.renderMenu()}
                <div className="content-container">
                    <div className="pageHeader">Datasets</div>
                    
                    <form className="searchForm" onSubmit={this.searchDatasets}>
                        <input className="searchInput" placeholder="Search..." type="search" value={this.state.query} onChange={this.updateQuery}></input>
                        <button type="submit" className="searchIcon"><i class="fa fa-search"></i></button>
                    </form>
                    <div className="importButton">Import</div> {/* change this to link later */}
                    {this.renderDatasetView()}
                </div>
                
            </div>
        
        )
    }
}


ReactDOM.render(<App />, document.getElementById("app"))