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
const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

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
          <Route path="/model" exact component={Models} />
          <Route path="/model/:id" exact component={Model} />
          <Route path="/import/model" exact component={CreateModel} />
          {/* <Route path="/login" component={Login} />
          <Route path="/register" component={Register} /> */}
        </ReactRouterDOM.HashRouter>
        )    
    }
}

class LineChart extends React.Component{
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
      }
    
      componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
          type: 'line',
          data: {
            labels: range(1, this.props.data.length),
            datasets: [{
              label: this.props.title,
              data: this.props.data,
              backgroundColor: this.props.color,
              borderColor: this.props.color,
              tension: 0.1
            }]
          }
        });
      }
    


    render() {
        return <canvas ref={this.chartRef} />
      }
}

class DoughnutChart extends React.Component{
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
      }
    
      componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
          type: 'doughnut',
          data: {
            labels: ["Accuracy", "Loss"],
            datasets: [{
              data: this.props.data,
              backgroundColor: this.props.color
            }]
          }
        });
      }

    render() {
        return <canvas ref={this.chartRef} />
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
                <SidebarButton name="Models" url="/model"/>
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
    constructor(props){
        super(props)
        this.state = {
             ...this.state, 
             loading:false,
             model:null,
             modelData:null,
             dataset:null
            }
    }

    renderTopBoard(){
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        else if (this.state.dataset === null && this.state.model===null && this.state.login){
            this.setState({ loading: true }, () => {
                fetch("/api/user/dataset")
                .then(response => response.json())
                .then(message => {
                    const randIndex = Math.floor(Math.random() * message.length)
                    fetch(`/api/dataset/${message[randIndex].id}`)
                    .then(response => response.json())
                    .then(message => {
                        console.log(message)
                        this.setState({
                            ...this.state,
                            "dataset":message,
                            loading:false
                        })
                    })
                });
                fetch("/api/user/model")
                .then(response => response.json())
                .then(message => {
                    const randIndex = Math.floor(Math.random() * message.length)
                    fetch(`/api/model/${message[randIndex].id}`)
                    .then(response => response.json())
                    .then(message => {
                        console.log(message)
                        this.setState({
                            ...this.state,
                            "model":message
                        }, async ()=>{
                            let model = await tf.loadLayersModel(message.upload)
                            this.setState({
                                ...this.state,
                                modelData:model
                            })
                        })
                    })
                });
            });
        }
        else if (!this.state.login)
        return(
            <div>
                <div className="pageHeader">Welcome!</div>
            </div>
        )
        else if(this.state.dataset !== null && this.state.model!==null&& this.state.modelData !==null && this.state.login){
            return(
                <div className="topDashboard">
                    <div className="accuracyChart">
                    <div className="cardHeader">{this.state.model.name}</div>
                        <DoughnutChart data={[this.state.model.accuracy, 1-this.state.model.accuracy]} color={["#a5ffa1", "#fc4e03"]} />
                    </div>
                    <div className="modelSummary">
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Dtype</th>
                            <th>Shape</th>
                            <th>Size</th>
                        </thead>
                        {this.state.modelData.weights.map((weight, index) =>{
                        let weightdata = weight["val"]
                            return(
                                <tr>
                                    <td>{weightdata.name}</td>
                                    <td>{weightdata.dtype}</td>
                                    <td>{JSON.stringify(weightdata.shape)}</td>
                                    <td>{weightdata.size}</td>
                                </tr>
                            ) 
                        })}
                    </table>
                    </div>
                </div>
            )
        }
    }
    renderTable(){
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        else if (this.state.dataset !== null && this.state.login)
        return(
            <div className="dataDashboard">
                <div className="cardHeader">{this.state.dataset.name}</div>
                <div className="dataSummary" dangerouslySetInnerHTML={{__html: this.state.dataset.dataset.trim()}}></div>
            </div>
        )
    }

    render() {
        return (
        <div className="div-container">
            {this.renderMenu()}
            <div className="content-container">
                {this.renderTopBoard()}
                {this.renderTable()}
            </div>
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

class Models extends Base{
    constructor(props){
        super(props)
        localStorage.clear()
        this.state = {
            ...this.state,
            loading:false,
            data:null,
            query:"",
            all:true,
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
                    <div id="allData" onClick={this.SetAll}>All Models</div>
                    <div id="uData" onClick={this.SetU}>Your Models</div>
                    <hr className="slider" />
                    
            </div>
            )
        }
        else if(!this.state.all)
        return (
            <div className="dataSelector">
            <div id="allData" onClick={this.SetAll}>All Models</div>
            <div id="uData" className="active" onClick={this.SetU}>Your Models</div>
            <hr className="slider" />
        </div>
        )
        else 
        return (
        <div className="dataSelector">
            <div id="allData" onClick={this.SetAll}>All Models</div>
            <div id="uData" className="inactive">Your Models</div>
            <hr className="slider" />
        </div>
        )
    }

    searchDatasets(){
        if(this.state.query !== ""){
            this.setState({ loading: true }, () => {
                fetch(`/api/model?query=${this.state.query}`)
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
                fetch("/api/model")
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
                fetch("/api/user/model")
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
                                 <td className="name"><Link to={`/model/${dataset.id}`}>{dataset.name}</Link></td> {/* have to be link */}
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
                                 <td className="name"><Link to={`/model/${dataset.id}`}>{dataset.name}</Link></td> {/* have to be link */}
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

    render(){
        return (
            <div className="div-container">
                {this.renderMenu()}
                <div className="content-container">
                        <div className="pageHeader">Models</div>
                        <form className="searchForm" onSubmit={this.searchDatasets}>
                        <input className="searchInput" placeholder="Search..." type="search" value={this.state.query} onChange={this.updateQuery}></input>
                        <button type="submit" className="searchIcon"><i class="fa fa-search"></i></button>
                        </form>
                        <div className="importButton"><Link to="/import/model">Create</Link></div> {/* change this to link later */}
                        {this.renderDatasetView()}
                </div>
            </div>
        )
    }
}


class Model extends Base {
    constructor(props){
        super(props)
        this.id = props.match.params.id
        this.state = {
            ...this.state,
            loading:false,
            data:null,
            model:null,
            getDataset:false,
            modelData:null,
            selectedDataset: null,
            table:null,
            preview:false,
            dataset:null,
            fields:[],
            label:-1,
            train_filter:[],
            label_filter:[],
            epoch:5,
            training:false,
            result:null,
            error:false
           }
        this.renderModel = this.renderModel.bind(this)
        this.selectedDatasetHandle = this.selectedDatasetHandle.bind(this)
        this.renderPreview = this.renderPreview.bind(this)
        this.renderTrainForm = this.renderTrainForm.bind(this)
        this.addField = this.addField.bind(this)
        this.chooseLabel = this.chooseLabel.bind(this)
        this.addTrainFilter = this.addTrainFilter.bind(this)
        this.addLabelFilter = this.addLabelFilter.bind(this)
        this.updateEpoch = this.updateEpoch.bind(this)
        this.startTrain = this.startTrain.bind(this)
    }
    startTrain(event){
        event.preventDefault();
        this.setState({ training: true }, () => {
            fetch(`/api/model/${this.state.model.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json; charset=UTF-8","X-CSRFToken": getCookie('csrftoken') },
                body: JSON.stringify({
                    "dataset": {
                        "field":this.state.fields,
                        "id":this.state.dataset.id,
                        "train_filter":this.state.train_filter,
                        "label_filter":this.state.label_filter,
                    },
                    "epoch":this.state.epoch,
                    "train":true
                })
                })
            .then(response => {
                if (response.ok){
                return response.json()
                }
                else{
                    this.setState({
                        training:false,
                        result:"Something went wrong with dataset you selected try using other model or change dataset.",
                        error:true
                    })
                    return false
                }
            })
            .then(message => {
                if (message !== false){
                this.setState({
                    training:false,
                    result:message
                })
            }
            })
        })
    }

    updateEpoch(event){
        this.setState(prevState => ({
            ...this.state,
            epoch:parseInt(event.target.value)
        })
    )
    }
    addField(event){
        let newField = this.state.fields
        if (newField.includes(event.target.value))
        newField.remove(event.target.value)
        else
            newField.push(event.target.value)
        console.log(newField)
        this.setState({
            ...this.state,
            fields:newField,
        })
    }
    addTrainFilter(event){
        let newField = this.state.train_filter
        if (newField.includes(event.target.value))
        newField.remove(event.target.value)
        else
            newField.push(event.target.value)
        console.log(newField)
        this.setState({
            ...this.state,
            train_filter:newField,
        })
    }
    addLabelFilter(event){
        let newField = this.state.label_filter
        if (newField.includes(event.target.value))
        newField.remove(event.target.value)
        else
            newField.push(event.target.value)
        console.log(newField)
        this.setState({
            ...this.state,
            label_filter:newField,
        })
    }
    chooseLabel(event){
        this.setState({
            ...this.state,
            label:event.target.value
        })
    }

    selectedDatasetHandle(event){
        this.setState({
            ...this.state,
            selectedDataset:event.target.value,
            preview:false,
            table:null
        })
    }

    renderPreview(){
        // console.log(this.state.data === null && this.state.searchResult===false)
        if (this.state.loading){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        else if (this.state.table === null && this.state.preview===false){
            // console.log(this.state.file)
            this.setState({ loading: true }, () => {
                fetch(`/api/dataset/${this.state.selectedDataset}`)
                .then(response => response.json())
                .then(message => {
                    // console.log(message)
                    this.setState({
                        ...this.state,
                        loading:false,
                        preview:true,
                        table:message.dataset,
                        dataset:message
                    })
                    
                });
            });
        }
        else if (this.state.preview){
            return <div className="dataTable" dangerouslySetInnerHTML={{__html: this.state.table}}></div>
                
            
        }
    }
    renderTrainForm(){
        if(this.state.dataset !== null){
            return (<div className="trainForm">
                <form id="train" onSubmit={this.startTrain}>
                    <label>Where is your label for training?</label><br />
                    <input type="radio" id="first" name="label_column" value="1" onClick={this.chooseLabel}></input>
                    <label for="first">First column of dataset</label><br />
                    <input type="radio" id="end" name="label_column" value="-1" onClick={this.chooseLabel}></input>
                    <label for="end">Last column of dataset</label><br /> <br />

                    <label>How much times would you like to go through data for</label>
                    <input type="number" onChange={this.updateEpoch} value={this.state.epoch} className="epochInput"></input><br /><br />

                    <label>What filter would you like for training data (optional)</label><br />
                    <input name="minMax" type="checkbox" value="minMax" onChange={this.addTrainFilter}></input>
                    <label for="minMax">Min Max Scaler</label><br />
                    <input name="Standardize" type="checkbox" value="Standardize" onChange={this.addTrainFilter}></input>
                    <label for="Standardize">Standardize</label><br />
                    <input name="normalize" type="checkbox" value="normalize" onChange={this.addTrainFilter}></input>
                    <label for="normalize">Normalize</label>
                    <br /><br />

                    <label>What filter would you like for training labels (optional)</label><br />
                    <input name="label" type="checkbox" value="label" onChange={this.addLabelFilter}></input>
                    <label for="label">Label Encode</label><br />
                    <input name="binarize" type="checkbox" value="binarize" onChange={this.addLabelFilter}></input>
                    <label for="binarize">Label Binarize</label>
                    <br /><br />
                    
                    <label>Select columns you want to use.</label><br />
                    <label>Don't Select any if you want to use all</label>
                    {this.state.dataset.columns.map((column, index) =>{
                            return(
                                <div>
                                <input name={column} type="checkbox" value={column} onChange={this.addField}></input>
                                <label for={column}>{column}</label>
                                </div>
                            ) 
                        })}
                </form>
            </div>)
        }
    }

    renderModel(){
        if (this.state.loading && this.state.model===null){
            return (
                <div className="spinner-container">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            )
        }
        
        else if (this.state.model===null && this.state.getDataset===false){
            this.setState({ loading: true }, () => {
                fetch(`/api/model/${this.id}`)
                .then(response => response.json())
                .then(message => {
                    // console.log(message)
                    this.setState({
                        ...this.state,
                        model:message
                    }, async ()=>{
                        let model = await tf.loadLayersModel(message.upload)
                        this.setState({
                            ...this.state,
                            modelData:model
                        })
                        fetch("/api/user/library")
                        .then(response => response.json())
                        .then(message => {
                            // console.log(message)
                            this.setState({
                                ...this.state,
                                loading:false,
                                data:message,
                                selectedDataset:message[0]["id"]
                            })
                                
                        });
                        
                    })
                    
                });
                
            });
        }
        else if (this.state.model!==null && this.state.modelData !== null && (!this.state.login || ( this.state.user !== 0 && this.state.user.id !== this.state.model.owner.id)))
        return(
            <div>
            <div className="pageHeader">{this.state.model.name}</div>
            <div className="weightValue">
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Dtype</th>
                        <th>Shape</th>
                        <th>Size</th>
                    </thead>
                    {this.state.modelData.weights.map((weight, index) =>{
                    let weightdata = weight["val"]
                        return(
                            <tr>
                                <td>{weightdata.name}</td>
                                <td>{weightdata.dtype}</td>
                                <td>{JSON.stringify(weightdata.shape)}</td>
                                <td>{weightdata.size}</td>
                            </tr>
                        ) 
                    })}
                </table>
            </div>
            </div>)
        else if (this.state.model !== null && this.state.data !== null && this.state.modelData !== null && this.state.training === false && this.state.result === null){
            return(
                <div>
                <div className="pageHeader">{this.state.model.name}</div>
                <div className="weightValue">
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Dtype</th>
                            <th>Shape</th>
                            <th>Size</th>
                        </thead>
                        {this.state.modelData.weights.map((weight, index) =>{
                        let weightdata = weight["val"]
                            return(
                                <tr>
                                    <td>{weightdata.name}</td>
                                    <td>{weightdata.dtype}</td>
                                    <td>{JSON.stringify(weightdata.shape)}</td>
                                    <td>{weightdata.size}</td>
                                </tr>
                            ) 
                        })}
                    </table>
                </div>
                <div className="datasetSelector">
                        <form>
                            <label>Selected Dataset</label><br />
                            
                            <select onChange={this.selectedDatasetHandle}>
                                {this.state.data.map((dataset, index)=>{
                                    return <option value={dataset["id"]}>{dataset["name"]}</option>
                                })}
                            </select>
                            <button type="submit" form="train" className="trainButton">Train</button>
                        </form>
                        {this.renderTrainForm()}
                </div>
                
                <div className="datasetDetail">
                {this.renderPreview()}
                </div>
                
                </div>
            )
        }
        
        else if(this.state.training){
            return (
                <div>
                <div className="pageHeader">{this.state.model.name}</div>
                <div className="weightValue">
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Dtype</th>
                            <th>Shape</th>
                            <th>Size</th>
                        </thead>
                        {this.state.modelData.weights.map((weight, index) =>{
                        let weightdata = weight["val"]
                            return(
                                <tr>
                                    <td>{weightdata.name}</td>
                                    <td>{weightdata.dtype}</td>
                                    <td>{JSON.stringify(weightdata.shape)}</td>
                                    <td>{weightdata.size}</td>
                                </tr>
                            ) 
                        })}
                    </table>
                </div>
                <div className="trainLoading">
                <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><br />
                <span>Training in progress this might take a few minutes...</span>
                </div>
                </div>
            )
        }
        else if(this.state.result !== null && this.state.error === false){
            return (
                <div>
                <div className="pageHeader">{this.state.model.name}</div>
                <div className="weightValue">
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Dtype</th>
                            <th>Shape</th>
                            <th>Size</th>
                        </thead>
                        {this.state.modelData.weights.map((weight, index) =>{
                        let weightdata = weight["val"]
                            return(
                                <tr>
                                    <td>{weightdata.name}</td>
                                    <td>{weightdata.dtype}</td>
                                    <td>{JSON.stringify(weightdata.shape)}</td>
                                    <td>{weightdata.size}</td>
                                </tr>
                            ) 
                        })}
                    </table>
                </div>
                <div className="results-container">
                    <div className="result">
                    <LineChart data={this.state.result.accuracy} title="Accuracy" color="#70CAD1" />
                    </div>
                    <div className="result">
                    <LineChart data={this.state.result.loss} title="Loss" color="#ffb0dd" />
                    </div>
                    <div className="break"></div>
                    <div className="result">
                    <LineChart data={this.state.result.val_accuracy} title="Validated Accuracy" color="#8feba8" />
                    </div>
                    <div className="result">
                    <LineChart data={this.state.result.val_loss} title="Validated Loss" color="#ffcdb0" />
                    </div>
                </div>
                
                </div>
            )
        }
        else if(this.state.result !== null && this.state.error){
            return (
                <div>
                <div className="pageHeader">{this.state.model.name}</div>
                <div className="weightValue">
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Dtype</th>
                            <th>Shape</th>
                            <th>Size</th>
                        </thead>
                        {this.state.modelData.weights.map((weight, index) =>{
                        let weightdata = weight["val"]
                            return(
                                <tr>
                                    <td>{weightdata.name}</td>
                                    <td>{weightdata.dtype}</td>
                                    <td>{JSON.stringify(weightdata.shape)}</td>
                                    <td>{weightdata.size}</td>
                                </tr>
                            ) 
                        })}
                    </table>
                </div>
                <div className="trainLoading">
                <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><br />
                <span className="error">{this.state.result}</span>
                {console.log(this.state.result)}
                </div>
                </div>
            )
        }
    }


    render(){
        return(
            <div className="div-container">
                {this.renderMenu()}
                <div className="content-container">
                    {this.renderModel()}
                </div>
            </div>
        )
    }
}

class CreateModel extends Base{
    constructor(props){
        super(props)
        this.layers = ["input", "dense", "dropout"]
        this.activation = ["relu", "elu", "hardSigmoid", "linear", "relu6", "selu", "sigmoid", "softmax", "softplus", "softsign", "tanh", "swish", "mish"]
        // const id = props.match.params.id
        this.state = {
            ...this.state,
            loading:false,
            title:"",
            model:tf.sequential(),
            description:"",
            redirect:false,
            alert:false,
            message:"",
            // dataset:true
            //layers stuff
            activation:"relu",
            rate:0,
            units:0,
            layer:"input"
           }
        this.updateTitle = this.updateTitle.bind(this)
        this.checkAlert = this.checkAlert.bind(this)
        this.updateDes= this.updateDes.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.renderModel = this.renderModel.bind(this)
        this.selectedLayerHandle = this.selectedLayerHandle.bind(this)
        this.applyLayer = this.applyLayer.bind(this)
        this.updateDense = this.updateDense.bind(this)
        this.updateRate = this.updateRate.bind(this)
        this.clearModel = this.clearModel.bind(this)
    }
    checkAlert(){
        if (this.state.alert)
        return <span className="error">{this.state.message}</span>
    }

    clearModel(event){
        this.setState(prevState => ({
            ...this.state,
            model:tf.sequential()
        })
    )
    }

    updateTitle(event){
        this.setState(prevState => ({
            ...this.state,
            title:event.target.value
        })
    )
    }
    updateDense(event){
        this.setState(prevState => ({
            ...this.state,
            units: parseInt(event.target.value)
        })
    )
    }

    updateRate(event){
        this.setState(prevState => ({
            ...this.state,
            rate: parseFloat(event.target.value)
        })
    )
    }

    selectedLayerHandle(event){
        console.log(event.target.value)
        this.setState({
            ...this.state,
            layer:event.target.value,
        })
    }
    selectedActivateHandle(event){
        console.log(event.target.value)
        this.setState({
            ...this.state,
            activation:event.target.value,
        })
    }

    applyLayer(){
        let model = this.state.model
        switch (this.state.layer){
            case "input":
                model.add(tf.layers.inputLayer({inputShape: [this.state.units]}))
                break
            case "dense":
                model.add(tf.layers.dense({units: this.state.units, activation: this.state.activation}))
                break
            case "dropout":
                model.add(tf.layers.dropout({ rate: this.state.rate }))
                break
        }
        this.setState({
            ...this.state,
            model:model
        })
    }

    updateDes(event){
        this.setState(prevState => ({
            ...this.state,
            description:event.target.value
        }))
    }
    submitForm(){
        const model_name = this.state.title.split(' ').join('_')
        
        this.state.model.save(`localstorage://${model_name}`);
        
        fetch("/api/model", {
            method: 'POST',
            headers: { "Content-Type": "application/json; charset=UTF-8","X-CSRFToken": getCookie('csrftoken') },
            body: JSON.stringify({
                "model":{
                    "modelTopology":JSON.parse(localStorage.getItem(`tensorflowjs_models/${model_name}/model_topology`)),
                    "weightsManifest":[{
                        "paths":[`./${model_name}.weights.bin`],
                        "weights":JSON.parse(localStorage.getItem(`tensorflowjs_models/${model_name}/weight_specs`))
                        }
                    ]},
                "weight":localStorage.getItem(`tensorflowjs_models/${model_name}/weight_data`),
                "name":this.state.title,
                "description":this.state.description,
            })
            })
        .then(response => {
            if (response.ok){
            return response.json()
            }
            else{
                this.submitForm()
                return false
            }
        })
        .then(message => {
            console.log(message)
            // localStorage.clear()
            if (message !== false)
            this.setState({
                ...this.state,
                redirect:true
            })
        })
    
    }

    renderModel(){
        if  (this.state.model.layers.length === 0)
        return (
            <div className="weightValue">
            <table>
                    <thead>
                        <th>Name</th>
                        <th>Dtype</th>
                        <th>Shape</th>
                        <th>Units</th>
                        <th>Size</th>
                    </thead>
                    <tr><td colspan="5" className="empty">--This Model is Empty--</td></tr>
            </table>
            </div>
        )
        return (
            <div className="weightValue">
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Dtype</th>
                            <th>Shape</th>
                            <th>Units</th>
                            <th>Size</th>
                        </thead>
                        {this.state.model.layers.map((layer, index) =>{
                            if (layer.name.includes("dense"))
                            return(
                                <tr>
                                    <td>{layer.name}</td>
                                    <td>{layer.kernel.val.dtype}</td>
                                    <td>{JSON.stringify(layer.kernel.val.shape)}</td>
                                    <td>{layer.units}</td>
                                    <td>{layer.kernel.val.size}</td>
                                </tr>
                            ) 
                        
                            if (layer.name.includes("input"))
                            return(
                                <tr>
                                    <td>{layer.name}</td>
                                    <td>{layer.dtype}</td>
                                    <td>{JSON.stringify(layer.batchInputShape)}</td>
                                    <td>none</td>
                                    <td>none</td>
                                </tr>
                            )}
                        )}
                    </table>
                    <button onClick={this.clearModel} className="clearButton">Clear All</button>
                </div>
        )
    }
    renderForm(){
        switch(this.state.layer){
            case "input":
                return(
                    <div>
                    <label>Input Shape</label><br />
                    <input type="number" value={this.state.units} onChange={this.updateDense}></input>
                    </div>
                )
            case "dense":
                return(
                    <div>
                    <label>Dense Units</label><br />
                    <input type="number" value={this.state.units} onChange={this.updateDense}></input><br />
                    <label>Activation Function</label><br />
                    <select onChange={this.selectedActivateHandle}>
                                {this.activation.map((layer, index)=>{
                                    return <option value={layer}>{layer}</option>
                                })}
                    </select><br />
                    </div>
                )
            case "dropout":
                return(
                    <div>
                    <label>Drop rate</label><br />
                    <input type="number" value={this.state.rate} onChange={this.updateRate}></input>
                    </div>
                )
        }
    }

    render(){
        if (this.state.redirect)
        return <Redirect to="/model" />

        if (this.state.login)
        return(
            <div className="div-container">
                {this.renderMenu()}
                <div className="content-container">
                <div className="pageHeader">Model Creation</div>
                <form className="importForm" onSubmit={this.submitForm}>
                    <button className="submitButton" type="submit">Submit</button>
                    {this.checkAlert()}
                    <input className="importInput" placeholder="Title..." value={this.state.title} onChange={this.updateTitle}></input>
                    <textarea className="importTextarea" placeholder="Description..." rows="3" contenteditable value={this.state.description} onChange={this.updateDes}></textarea>
                </form>
                <div className="layerForm">
                    <form onSubmit={this.applyLayer}>
                        <label>Choose Layer you would like to add to the model</label><br />
                        <label>Layer Types</label><br />
                        <select onChange={this.selectedLayerHandle}>
                                {this.layers.map((layer, index)=>{
                                    return <option value={layer}>{layer}</option>
                                })}
                        </select><br />
                        {this.renderForm()}
                        <button className="applyButton" type="submit">Apply</button>
                    </form>
                </div>

                {this.renderModel()}
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


window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };


ReactDOM.render(<App />, document.getElementById("app"))

