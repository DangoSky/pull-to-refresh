import React, { PureComponent } from 'react';
import PullRefresh from '../index';
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

  // initData = (resolve) => {
  //   setTimeout(() => {
  //     console.log(this.state.list);
  //     this.setState({
  //       list: ARR
  //     }, () => {
  //       console.log(this.state.list);
  //     })
  //   }, 1000);
  // }

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
      }, 5000);
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
      <div className="container">
        <PullRefresh
          hasMore
          initData={this.handleMore}
          loadFn={this.handleMore}
          refreshFn={this.handleMore}
        >
          <div className="content">
            { this.renderList() }
          </div>
        </PullRefresh>
      </div>
    )
  }
}
