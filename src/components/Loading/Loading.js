import Inferno from 'inferno';
import Component from 'inferno-component';
import './Loading.css';

class Loading extends Component {
    render(props) {
        return(
                <div className="Loading">
                {
                  <img className="Loading-img" src={props.name} alt='Loading...' />
                }
                </div>
              );
    }
}

export default Loading;
