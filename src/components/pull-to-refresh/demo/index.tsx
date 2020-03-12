import React, { PureComponent } from 'react';
import PullRefresh from '../index';
import './style.less';

const ARR = Array.from(Array(15)).map((item, index) => index + 1);

interface State {
  list: number[],
  hasMore: boolean
}

export default class Demo extends PureComponent<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      list: [],
      hasMore: true,
    }
  }

  initData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({
          list: ARR,
          hasMore: true
        });
        resolve();
      }, 1000);
    })
  }

  refreshData = async (resolve: () => void) => {
    await this.initData();
    resolve();
  }

  fetchData = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({
          list: this.state.list.concat(ARR),
          hasMore: this.state.list.length >= 45 ? false : true
        }, () => {
          console.log(this.state.list);
        })
        resolve();
      }, 2000);
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
          hasMore={this.state.hasMore}
          initData={this.refreshData}
          loadMoreFn={this.handleMore}
          refreshFn={this.refreshData}
        >
          <div className="content">
            { this.renderList() }
          </div>
        </PullRefresh>
      </div>
    )
  }
}
