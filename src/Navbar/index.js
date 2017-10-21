import './navbar.css';
import { Link } from 'inferno-router';
import Component from 'inferno-component';

class Navbar extends Component {
  state = {
    score: '',
    name : '',
    email: ''
  }
  async componentDidMount() {
    await this.fetchUsername()
  }

  async fetchUsername() {
    var res1 = await window.fetchWithAuth(`/users`);
    res1 = await res1.json();
    var user_name,user_score;
    for(var i =0 ; i< res1.length ; i++)
      if(res1[i].email === window.email)
        {
          user_name = res1[i].name;
          user_score = res1[i].score;
          break;
        }
    if (!res1.error) this.setState({ score: user_score, name: user_name , loading: false })
    else this.setState({ error: res1.error, loading: false })
  }

  render() {
    const { email ,score , name} = this.state;

    return (
      <nav className="navigation">
    <section className="container">
      <Link className="navigation-title" to="/"><h1 className="title">Contest Portal</h1></Link>
      {!window.email ?
        <ul className="navigation-list float-right">
          <li className="navigation-item"><Link to='/login' className="navigation-link">Login</Link></li>
        </ul>
        :
        <ul className="navigation-list float-right">
          <li className="navigation-item navigation-link"> Hello {name} </li>
          <li className="navigation-item navigation-link"> Current score : {score} </li>
          <li className="navigation-item"><Link to='/scoreboard' className="navigation-link">Scoreboard</Link></li>
          <li className="navigation-item"><Link to='/logout' className="navigation-link">Logout</Link></li>
        </ul>
      }
    
    </section>
  </nav>
    )
  }
}

export default Navbar;
