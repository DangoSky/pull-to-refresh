import React, { PureComponent } from 'react';
import PullToRefresh from '../index';
import './style.less';
import { resolve } from 'url';

const ARR = Array.from(Array(15)).map((item, index) => index + 1);

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
    this.fetchData();
  }

  fetchData = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(this.state.list);
        this.setState({
          list: this.state.list.concat(ARR)
        }, () => {
          console.log(this.state.list);
        })
        resolve();
      }, 1000);
    })
  }

  handleMore = async (resolve: () => void) => {
    await this.fetchData();
    resolve();
  }

  renderList = () => {
    const { list } = this.state;
    return list.map((item, index) => {
      return (
        <p key={index}>{ item }</p>
      )
    })
  }

  render() {
    return (
      <div className="box">
        <PullToRefresh
          hasMore
          refreshCallback={this.handleMore}
        >
          <div className="container">
            { this.renderList() }
          </div>
        </PullToRefresh>
      </div>
    )
  }
}
