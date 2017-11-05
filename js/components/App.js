import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import IncrementMutation from '../mutations/IncrementMutation'
import DecrementMutation from '../mutations/DecrementMutation'

class App extends React.Component {

  static propTypes = {
    relay:PropTypes.shape({
      commitUpdate: PropTypes.func.isRequired
    }),
    counter: PropTypes.shape({
      id: PropTypes.string,
      count: PropTypes.int
    })

  }

  _increment = () => {
    this.props.relay.commitUpdate(
      new IncrementMutation({
        counter: this.props.counter
      })
    )
  }
  _decrement = () => {
    this.props.relay.commitUpdate(
      new DecrementMutation({
        counter: this.props.counter
      })
    )
  }
  render() {
    return (
      <div>
        {this.props.counter.count}
        <button onClick={this._increment}> + </button>
        <button onClick={this._decrement}> - </button>
      </div>

    )
  }
}

export default Relay.createContainer(App, {
  fragments: {
    counter: () => Relay.QL`
      fragment on User {
        id,
        count,
        ${IncrementMutation.getFragment('counter')}
        ${DecrementMutation.getFragment('counter')}
    }
    `
  }
})
