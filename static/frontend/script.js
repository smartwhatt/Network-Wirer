const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Redirect = ReactRouterDOM.Redirect;
const useParams   = ReactRouter.useParams;

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
          <Route path="/dataset/:id" exact component={Dataset} />
          <Route path="/library" exact component={Library} />
          <Route path="/library/add/:id" exact component={AddLibrary} />
          <Route path="/import/dataset" exact component={ImportDataset} />
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

    renderLibrary(){
        if(this.props.login){
            return <SidebarButton name="Library" url="/library"/>
        }
    }
    render(){
        return (
            <div className="sidebar-container">
                <SidebarButton name="Home" url="/"/>
                <SidebarButton name="Datasets" url="/dataset"/>
                <SidebarButton name="Models" url="/"/>
                {this.renderLibrary()}
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
            <Sidebar login={this.state.login} />
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
                    <input type="text" placeholder="Username" className="textInput" id="username" autocomplete="username" autofocus="true" value={this.state.username} onChange={this.updateUsername}></input>
                    <input type="password" placeholder="Password" className="textInput" id="current-password" autocomplete="password" value={this.state.password} onChange={this.updatePassword}></input>
                    {this.checkAlert("Password or Username incorrect")}
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
                    <input type="email" placeholder="Email" className="textInput" id="email" autocomplete="email" value={this.state.email} onChange={this.updateEmail}></input>
                    <input type="password" placeholder="Password" className="textInput" autocomplete="current-password" id="password" value={this.state.password} onChange={this.updatePassword}></input>
                    <input type="password" placeholder="Confirm Password" className="textInput" autocomplete="confirm-password" id="password2" value={this.state.conf_password} onChange={this.updateConPass}></input>
                    {this.checkAlert("The passwords you entered do not match")}
                    <input type="submit" className="submitButton" value="Sign up"></input>
                    <div className="submitButton" onClick={this.changeState} >Sign In?</div>
                </form>
            </div>
            )
    }
    checkAlert(message){
        if(this.state.passAlert){
        
        return <span className="error">{message}</span>
        }
    }

    changeState() {
        this.setState(prevState => ({
                ...this.state,
                signup:!prevState.signup,
                passAlert:false
            })
        )
    }
    SetSignin() {
        this.setState(prevState => ({
                ...this.state,
                signup:false,
                passAlert:false
            })
        )
    }
    SetSignup() {
        this.setState(prevState => ({
                ...this.state,
                signup:true,
                passAlert:false
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
        .then(response => {
            if (!response.ok){
                this.setState(prevState => ({
                    ...this.state,
                    passAlert:true
                }),() => {return false;}
                )
            }
            else
            return response.json()
        })
        .then(result => {
            // Print result
            this.setState(prevState => ({
                ...this.state,
                redirect:true
            })
            )
            return false
        })
        .catch(error => {
            console.error(error)
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
                                 <td className="name"><Link to={`/dataset/${dataset.id}`}>{dataset.name}</Link></td> {/* have to be link */}
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
                                 <td className="name"><Link to={`/dataset/${dataset.id}`}>{dataset.name}</Link></td> {/* have to be link */}
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
                    <div className="importButton"><Link to="/import/dataset">Import</Link></div> {/* change this to link later */}
                    {this.renderDatasetView()}
                </div>
                
            </div>
        
        )
    }
}

class Dataset extends Base {
    constructor(props){
        super(props)
        const id = props.match.params.id
        this.state = {
            ...this.state,
            dataset: null,
            loading:false,
            dataLoaded:false,
            id:id,
            detail:true
           }
        // this.getDataset = this.getDataset.bind(this)
        this.renderDataset = this.renderDataset.bind(this)
        this.renderDetailCard = this.renderDetailCard.bind(this)
        this.changeState = this.changeState.bind(this)
        this.renderTable = this.renderTable.bind(this)
    }

    changeState() {
        this.setState(prevState => ({
                ...this.state,
                detail:!prevState.detail
            })
        )
    }
    renderTable(){
        if (this.state.detail){
            return <div className="dataTable" dangerouslySetInnerHTML={{__html: this.state.dataset.summary.trim()}}></div>
        }
        else if (this.state.detail===false){
            return <div className="dataTable" dangerouslySetInnerHTML={{__html: this.state.dataset.dataset.trim()}}></div>
        }
    }

    

    renderDetailCard(){
        if (this.state.detail && this.state.dataset !== null){
            return(
                <div className="datasetDetail">
                    <div className="datasetSelector">
                        <div id="detail">Detail</div>
                        <div id="table" onClick={this.changeState}>Table</div>
                        <hr className="slider" />
                    </div>
                    {this.renderTable()}
                </div>
            )
        }
        else{
            return(
                <div className="datasetDetail">
                    <div className="datasetSelector">
                        <div id="detail" onClick={this.changeState}>Detail</div>
                        <div id="table" className="active">Table</div>
                        <hr className="slider" />
                    </div>
                    {this.renderTable()}
                </div>
            )
        }
    }

    renderDataset(){
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        
        else if (this.state.dataset === null && this.state.dataLoaded === false){
            // console.log(this.state.dataset === null && this.state.dataLoaded === false)
            this.setState({ loading: true }, () => {
                fetch(`/api/dataset/${this.state.id}`)
                .then(response => response.json())
                .then(message => {
                    this.setState({
                        ...this.state,
                        loading:false,
                        dataset:message,
                        dataLoaded:true
                    })
                });
            });
        }
        else if (this.state.dataset !== null && this.state.dataLoaded)
        return( 
            <div>
                <div className="datasetHeader">
                    {this.state.dataset.name}
                    <div>
                        <button className="datasetButton">
                            <a href={this.state.dataset.upload}>Download</a>
                        </button>
                        <button className="datasetButton">
                            <Link to={`/library/add/${this.state.dataset.id}`}>Add to library</Link>
                        </button>
                    </div>
                </div>

                <div className="datasetDescription">
                    <span>Description</span>
                    <p>{this.state.dataset.description}</p>
                </div>
                {this.renderDetailCard()}
                {/* {console.log(this.state.dataset.summary)} */}
                
            </div>
        )
    }

    render() {
        return (
        <div className="div-container">
            {this.renderMenu()}
            <div className="content-container">
                {this.renderDataset()}
            </div>
        </div>
        )
    }
}

class Library extends Base{
    constructor(props){
        super(props)
        // const id = props.match.params.id
        this.state = {
            ...this.state,
            data: null,
            loading:false,
            query:"",
            searchResult:false,
            dataset:true
           }
        this.searchDatasets = this.searchDatasets.bind(this)
        this.updateQuery = this.updateQuery.bind(this)
        this.renderDataTable = this.renderDataTable.bind(this)
        this.changeState = this.changeState.bind(this)
        this.renderDataState = this.renderDataState.bind(this)
    }

    searchDatasets(){
        if(this.state.query !== ""){
            this.setState({ loading: true }, () => {
                fetch(`/api/user/library?query=${this.state.query}`)
                .then(response => response.json())
                .then(message => {
                    console.log(message)
                    this.setState({
                        ...this.state,
                        loading:false,
                        data:message,
                        searchResult:true,
                        query:"",
                        dataset:true
                    })
                    
                });
            });
        }
    }

    changeState() {
        this.setState(prevState => ({
                ...this.state,
                dataset:!prevState.dataset,
                searchResult:false,
                data:null
            })
        )
    }

    renderDataState(){
        if(this.state.dataset){
            return(
            <div className="dataSelector">
                    <div id="data">Dataset</div>
                    <div id="model" onClick={this.changeState}>Model</div>
                    <hr className="slider" />
                    
            </div>
            )
        }
        else if(!this.state.dataset)
        return (
            <div className="dataSelector">
            <div id="data" onClick={this.changeState}>Dataset</div>
            <div id="model" className="active">Model</div>
            <hr className="slider" />
        </div>
        )
    }

    renderDataTable(){
        // console.log(this.state.data === null && this.state.searchResult===false)
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        else if (this.state.data === null && this.state.searchResult===false){
            this.setState({ loading: true }, () => {
                fetch("/api/user/library")
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
        else if (this.state.data !== null && this.state.searchResult===false && this.state.dataset){
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
                                 <td className="name"><Link to={`/dataset/${dataset.id}`}>{dataset.name}</Link></td> {/* have to be link */}
                                <td className="description">{dataset.description}</td>
                                <td className="owner">{dataset.owner.username}</td>
                            </tr>
                        ) 
                    })}
                </table>
            )
        }
        else if (this.state.data !== null && this.state.searchResult && this.state.dataset){
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
                                 <td className="name"><Link to={`/dataset/${dataset.id}`}>{dataset.name}</Link></td> {/* have to be link */}
                                <td className="description">{dataset.description}</td>
                                <td className="owner">{dataset.owner.username}</td>
                            </tr>
                        ) 
                    })}
                </table>
            )
        }
    }

    updateQuery(event){
        this.setState(prevState => ({
            ...this.state,
            query:event.target.value
        })
    )
    }

    render(){
        if (this.state.login)
        return(
            <div className="div-container">
            {this.renderMenu()}
            <div className="content-container">
                <div className="pageHeader">Library</div>

                <div className="searchContainer">
                    <form className="searchForm" onSubmit={this.searchDatasets}>
                        <input className="searchInput" placeholder="Search..." type="search" value={this.state.query} onChange={this.updateQuery}></input>
                        <button type="submit" className="searchIcon"><i class="fa fa-search"></i></button>
                    </form>
                </div>
                {this.renderDataState()}
                <div class="datasetsView">
                    {this.renderDataTable()}
                </div>
            </div>
        </div>
        )
        else
        return(
            <div className="div-container">
                {this.renderMenu()}
                <div className="content-container">
                    <div className="pageHeader">Library</div>
                    <span className="error">User not logged in</span><br />
                    <Link to="signin">Login here</Link>
                </div>
            </div>
        ) 
    }
}

class AddLibrary extends Base {
    constructor(props){
        super(props)
        this.addLibrary()
        this.state = {
            ...this.state,
            loading:true
           }
    }

    addLibrary(){
        fetch("/api/user/library", {
            method: 'PUT',
            headers: { "Content-Type": "application/json; charset=UTF-8", 'X-CSRFToken': getCookie('csrftoken') },
            body: JSON.stringify({
                "id": this.props.match.params.id
            })
            })
        .then(response => response.json())
        .then(message => {
            this.setState({
                ...this.state,
                loading:false
            })
        });
    }

    render() {
        if(!this.state.loading)
        return <Redirect to="/library" />
        else
        return <div className="spinner-container">
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    }
}

class ImportDataset extends Base {
    constructor(props){
        super(props)
        // const id = props.match.params.id
        this.state = {
            ...this.state,
            loading:false,
            title:"",
            file:null,
            description:"",
            redirect:false,
            alert:false,
            message:"",
            preview:false,
            table:null
            // dataset:true
           }
        this.updateTitle = this.updateTitle.bind(this)
        this.checkAlert = this.checkAlert.bind(this)
        this.dropHandle = this.dropHandle.bind(this)
        this.uploadClick = this.uploadClick.bind(this)
        this.uploadhandle = this.uploadhandle.bind(this)
        this.renderDataTable = this.renderDataTable.bind(this)
        this.updateDes= this.updateDes.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }
    checkAlert(){
        if (this.state.alert)
        return <span className="error">{this.state.message}</span>
    }

    updateTitle(event){
        this.setState(prevState => ({
            ...this.state,
            title:event.target.value
        })
    )
    }
    updateDes(event){
        this.setState(prevState => ({
            ...this.state,
            description:event.target.value
        }))
    }

    renderDataTable(){
        // console.log(this.state.data === null && this.state.searchResult===false)
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        else if (this.state.file !== null && this.state.preview===false){
            // console.log(this.state.file)
            this.setState({ loading: true }, () => {
                fetch("/api/preview/dataset", {
                    method: 'POST',
                    headers: { 
                        "Content-Type": "application/json; charset=UTF-8", 
                        'X-CSRFToken': getCookie('csrftoken'),
                        "Content-Disposition": `attachment; filename="${this.state.file.name}" `
                    },
                    body: this.state.file
                })
                .then(response => response.json())
                .then(message => {
                    // console.log(message)
                    this.setState({
                        ...this.state,
                        loading:false,
                        table:message,
                        preview:true,
                        table:message.table
                    })
                    
                });
            });
        }
        else if (this.state.preview){
            // console.log(this.state.table.trim())
            return <div className="dataTable" dangerouslySetInnerHTML={{__html: this.state.table}}></div>
        }
    }

    uploadhandle(event){
        event.preventDefault()
        let file = event.target.files[0]
        if (file.name.split('.').pop()==="csv")
                    this.setState({
                        ...this.state,
                        file:file
                    })
                else
                this.setState({
                    ...this.state,
                    alert:true,
                    message:"File extension \"csv\" only accepted"
                })
    }

    dropHandle(event){
        event.preventDefault();
        this.setState({
            ...this.state,
            preview:false
        }, () =>{
            // console.log("file dropped")
        if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < event.dataTransfer.items.length; i++) {
              // If dropped items aren't files, reject them
              if (event.dataTransfer.items[i].kind === 'file') {
                var file = event.dataTransfer.items[i].getAsFile();
                // console.log(file.name);
                if (file.name.split('.').pop()==="csv")
                    this.setState({
                        ...this.state,
                        file:file
                    })
                else
                this.setState({
                    ...this.state,
                    alert:true,
                    message:"File extension \"csv\" only accepted"
                })
              }
            }
          } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < event.dataTransfer.files.length; i++) {
            //   console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name.split('.').pop());
              if (event.dataTransfer.files[i].name.split('.').pop()==="csv")
                this.setState({
                    ...this.state,
                    file:event.dataTransfer.files[i]
                })
              else
                this.setState({
                    ...this.state,
                    alert:true,
                    message:"File extension \"csv\" only accepted"
                })
              
            }
          }
        })
        
    }
    uploadClick(){
        document.querySelector("#file").click()
    }

    submitForm(){
        if(this.state.title==="" || this.state.file === null){
            this.setState({
                ...this.state,
                alert:true,
                message:"Form not filled correctly"
            })
        }
        else{
            var formData  = new FormData();
            formData.append("name", this.state.title);
            // console.log(formData)
            formData.append("description", this.state.description);
            // console.log(formData)
            formData.append("file", this.state.file);
            console.log(formData)
            fetch("/api/dataset", {
                method: 'POST',
                headers: { 
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: formData
            })
            .then(response => response.json())
            .then(message => {
                console.log(message)
                this.setState({
                    ...this.state,
                    redirect:true
                })
                
            });
        }
    }

    render(){
        if (this.state.redirect)
            return <Redirect to="/library" />
        
        return(
            <div className="div-container">
                {this.renderMenu()}
                <div className="content-container">
                    <form className="importForm" onSubmit={this.submitForm}>
                        <div className="pageHeader">Import Dataset</div>
                        <button className="submitButton" type="submit">Submit</button>
                        {this.checkAlert()}
                        <input className="importInput" placeholder="Title..." value={this.state.title} onChange={this.updateTitle}></input>
                        <textarea className="importTextarea" placeholder="Description..." rows="3" contenteditable value={this.state.description} onChange={this.updateDes}></textarea>
                        <div className="dataDropBox" onDrop={this.dropHandle} onClick={this.uploadClick}>
                            <span>Drop file here to upload</span>
                            <input type="file" id="file" onChange={this.uploadhandle} accept=".csv"></input>
                        </div>
                        <div className="previewCard">
                            <span>Preview</span>
                            {this.renderDataTable()}
                        </div>
                        
                    </form>
                </div>
            </div>
        ) 
    }
}

window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };


ReactDOM.render(<App />, document.getElementById("app"))