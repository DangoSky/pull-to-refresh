import React, { PureComponent, ReactNode } from 'react';
import './style.less';

interface PullToRefreshProps {
  children: ReactNode,
  classname?: string,
  refreshCallback?: Function,
  hasMore?: boolean,
  noMoreDataText?: string,
  pullToRefreshHint?: string,
  loadingIcon?: ReactNode,
  loadingIconStatus?: 'normal' | 'rotate'
  loadingText?: string,
  
}

const STATUS = {
  init: '',
  pullToRefresh: 'pull-to-refresh',
  loading: 'loading',
}

class PullToRefresh extends PureComponent<PullToRefreshProps> {
  private divRef = React.createRef<HTMLDivElement>()

  state = {
    footerStatus: STATUS.init,
  }

  renderFooter = () => {
    const {
      hasMore,
      noMoreDataText = '无更多数据',
      pullToRefreshHint = '下拉页面加载更多数据',
      loadingText = '正在加载'
    } = this.props;
    const { footerStatus } = this.state;
    const footerText = footerStatus === STATUS.pullToRefresh ? (
      // TODO: icon
      <div className="dangosky-will-load">
        <span>{pullToRefreshHint}</span>
      </div>
    ) : footerStatus === STATUS.loading ? (
      <div className="dango-loading">
        <span>{loadingText}</span>
      </div>
    ) : null;
    return hasMore ? footerText : <p>{noMoreDataText}</p>;
  }

  touchStart = (e: any) => {
    // console.log('start');
    // console.log(this);
    // if (this.divRef.current) {
    //   console.log(this.divRef.current.scrollTop);
    //   console.log(this.divRef.current.scrollHeight);
    //   console.log(this.divRef.current.clientHeight);
    // }
    // console.log(e.touches[0]);
  }

  touchMove = (e: any) => {
    // console.log('move');
    // console.log(e.touches[0]);
  }

  touchEnd = (e: any) => {
    // console.log('end');
    // console.log(e.touches[0]);
  }

  scroll = (e: any) => {
    // TODO：可以不使用 ref 而使用 e.currentTarget？
    // const ref = this.divRef.current;
    const ref = e.currentTarget;
    const { hasMore, refreshCallback } = this.props;
    // TODO: 指定距离刷新
    if (
      ref &&
      hasMore &&
      refreshCallback &&
      ref.scrollHeight <= ref.scrollTop + ref.clientHeight
    ) {
      console.log('bottom');
      this.setState({
        footerStatus: STATUS.loading
      })
      refreshCallback(() => {
        // 加载数据完成后改变 footer 状态
        this.setState({
          footerStatus: STATUS.init
        })
      });
    }
  }

  render() {
    const {
      hasMore,
      noMoreDataText = '无更多数据',
      pullToRefreshHint = '下拉页面加载更多数据',
      loadingText = '正在加载'
    } = this.props;

    return (
      <div
        className="dangosky-pull-refresh-container"
        ref={this.divRef}
        onScroll={this.scroll}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
      >
        {/* <div className="dangosky-header">
          TODO: 上拉刷新
        </div> */}
        <div className="dangosky-body">
          {this.props.children}
        </div>
        <div className="dangosky-footer">
          {this.renderFooter()}
        </div>
      </div>
    )
  }
}

export default PullToRefresh;
