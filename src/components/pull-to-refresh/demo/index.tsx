import React, { PureComponent } from 'react';
import PullToRefresh from '../index';
import './style.less';

const ARR = [1, 2, 3, 4, 5, 6];

interface State {
  list: number[]
}

export default class Demo extends PureComponent<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.addData();
  }

  addData() {
    setTimeout(() => {
      this.setState({
        list: this.state.list.concat(ARR)
      })
    }, 500);
  }

  renderList() {
    const { list } = this.state;
    return list.map((item, index) => {
      return (
        <p key={index}>{ item }</p>
      )
    })
  }

  render() {
    return (
      <>
        <PullToRefresh>
          <div className="container">
            { this.renderList() }
          </div>
        </PullToRefresh>
      </>
    )
  }
}
