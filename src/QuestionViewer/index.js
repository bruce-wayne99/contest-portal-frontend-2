import { Link } from 'inferno-router';
import linkState from 'linkstate';
import Component from 'inferno-component';
import Loading from '../components/Loading/Loading';

var Remarkable = require('remarkable');
var plugin = require('remarkable-katex');
var md = new Remarkable({
  html:         true,
  linkify:      true,
  typographer:  true,
});
md.use(plugin);
class QuestionViewer extends Component {
  state = {
    maxQuestion : '',
    maxUnlocked : '',
    question: {},
    loading: true,
    error: '',
    status: '',
  }
  async componentDidMount() {
    await this.fetchQuestion()

  }
  async componentWillReceiveProps(nextProps) {
    await this.fetchQuestion(nextProps.params.qno)
  }
  async fetchQuestion(qno = this.props.params.qno) {
    var res = await window.fetchWithAuth(`/questions/${qno}`);
    if(res.status!==200){
      if (!res.error) this.setState({ status: res.status, loading: false })
      else this.setState({ error: res.error, loading: false })
    }

    res = await res.json();

    var res1 = await window.fetchWithAuth(`/users`);
    res1 = await res1.json();

    var user_id;
    for(var i =0 ; i< res1.length ; i++)
      if(res1[i].email === window.email)
        {
          user_id = res1[i].id;
          break;
        }
    var res2 = await window.fetchWithAuth(`/users/${user_id}`);
    res2 = await res2.json();

    var res3 = await window.fetchWithAuth('/questions');
    res3 = await res3.json();
    if (!res3.error) this.setState({ maxQuestion: res3.length, loading: false })
    else this.setState({ error: res3.error, loading: false })

    if (!res.error) this.setState({ question: res, loading: false })
    else this.setState({ error: res.error, loading: false })
    if (!res2.error) this.setState({ maxUnlocked: res2.maxUnlock, loading: false })
    else this.setState({ error: res2.error, loading: false })
  }

		checkAnswer = e => {
			e.preventDefault();
			const answer = e.target[0].value;
			const qno = this.props.params.qno;
      const iqno = parseInt(this.props.params.qno,10);
      const {maxQuestion} = this.state;

			var url = `/api/questions/${qno}/answer`
			var opt = {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					email: window.email,
				},
				body: `answer=${answer}`,
			};

			fetch(url, opt)
			.then(response => response.json())
			.then(json => {
				console.log(json.response);
				if(json.response){
          if(iqno < maxQuestion)
          window.location.href = `/question/${iqno+1}`
          else
            alert("You finished the contest! Congrats");
				}
				else alert("Wrong Answer!");
			});
	}

  render() {
    const { loading, question, error, answer , maxUnlocked, maxQuestion, status} = this.state
    const qno = parseInt(this.props.params.qno,10)
     if(status === 403)
    return(
    <h1 style="text-align:center;">403 Forbidden</h1>
    )
  if(status === 404)
    return(
    <h1 style="text-align:center;">404 Page Not Found</h1>
    )
    else
    return (
      <div>
        {loading && <div>Loading...</div>}
        <h1>Q{question.qno}: {question.title}</h1>
        {error && <div className="error">ERROR: {error}</div>}
        <p>
          <div dangerouslySetInnerHTML={{__html: md.render(`${question.body}`)}} />
        </p>
        {question.image && <Loading name={question.image}/>}
        <form onSubmit={this.checkAnswer}>
          <label for='answer'>Answer</label>
          <input type='text' name='answer' value={answer} onInput={linkState(this, 'answer')} />
          <button class='button-primary float-right'>Check</button>
        </form>
        <div class="clearfix" />
        {
          qno!==1 &&
            <Link className="button float-left" to={`/question/${qno-1}`}>
              Prev
            </Link>
        }
        {
          qno!== maxQuestion && qno < maxUnlocked &&
            <Link className="button float-right" to={`/question/${qno+1}`}>
              Next
            </Link>
        }
      </div>
    )

  }
}

export default QuestionViewer;
