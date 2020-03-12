import React, { PureComponent, ReactNode } from 'react';
import './style.less';
import dropDownSvg from './images/drop-down.svg';
import loadingSvg from './images/loading.svg';
import completeSvg from './images/complete.svg';

interface PullRefreshProps {
  children: ReactNode,
  hasMore: boolean,                // 是否还有更多数据
  className?: string,              // 外层类名
  loadMoreFn?: (fn: () => void) => void,  // 上拉页面后加载更多的函数，
  refreshFn?: (fn: () => void) => void,   // 下拉页面后刷新数据的函数，不传的话表示不开启下拉刷新功能
  noMoreDataText?: string,          // 没有更多数据的文案
  pullUpLoadText?: string,          // 上拉加载更多的文案
  loadingText?: string,             // 正在加载的文案
  distancePullUpLoad?: number,      // 距离底部多大距离就开始加载更多数据
  pullDownRefreshText?: string,     // 下拉刷新的文案
  loosenRefreshText?: string,       // 松开刷新的文案
  refreshingText?: string,          // 正在刷新的文案
  refreshedText?: string,           // 刷新完成的文案
  distancePullDownRefresh?: number, // 下拉多大的距离后松开就开始刷新
  loadingIcon?: ReactNode,          // 加载中的 icon
  completeIcon?: ReactNode,         // 加载完成的 icon
  pullUpIcon?: ReactNode,           // 上拉加载更多的 icon
  pullDownIcon?: ReactNode,         // 下拉刷新的 icon
  loosenIcon?: ReactNode,           // 松开刷新的 icon
}

const STATUS = {
  init: 'init',                       // 初始状态
  pullUpLoad: 'pull-up-load',         // 上拉加载更多
  loading: 'loading',                 // 加载中
  pullDownRefresh: 'pull-down-refresh',   // 下拉刷新
  loosenRefresh: 'loosen-refresh',    // 松开刷新
  refreshing: 'refreshing',           // 刷新中
  refreshed: 'refreshed'              // 刷新完成
}

class PullRefresh extends PureComponent<PullRefreshProps> {
  static initialTouch = {
    clientY: 0,
    scrollTop: 0
  }

  state = {
    headerStatus: STATUS.init,
    footerStatus: STATUS.init,
    pullHeight: 0,
  }

  renderHeader = () => {
    const { headerStatus } = this.state;
    const {
      pullDownRefreshText = '下拉刷新',
      loosenRefreshText = '松开刷新',
      refreshingText = '正在刷新',
      refreshedText = '刷新完成',
      pullDownIcon,
      loosenIcon,
      loadingIcon,
      completeIcon
    } = this.props;

    const pullRefresh = (
      <>
        {pullDownIcon ? pullDownIcon : <i></i>}
        <span>{pullDownRefreshText}</span>
      </>
    );
    const loosenRefresh = (
      <>
        {loosenIcon ? loosenIcon : <i></i>}
        <span>{loosenRefreshText}</span>
      </>
    )
    const refreshing = (
      <>
        {loadingIcon ? loadingIcon : <img src={loadingSvg} alt="" className="icon-loading" />}
        <span>{refreshingText}</span>
      </>
    );
    const refreshed = (
      <>
        {completeIcon ? completeIcon : <img src={completeSvg} alt="" />}
        <span>{refreshedText}</span>
      </>
    )
    switch(headerStatus) {
      case STATUS.pullDownRefresh: return pullRefresh;
      case STATUS.loosenRefresh: return loosenRefresh;
      case STATUS.refreshing: return refreshing;
      case STATUS.refreshed: return refreshed;
      default: return null;
    }
  }

  renderFooter = () => {
    const {
      hasMore,
      loadMoreFn,
      noMoreDataText = '无更多数据',
      pullUpLoadText = '上拉页面加载更多数据',
      loadingText = '正在加载',
      loadingIcon,
      pullUpIcon
    } = this.props;
    const { footerStatus } = this.state;
    const footerText = footerStatus === STATUS.pullUpLoad ? (
      <>
        {pullUpIcon ? pullUpIcon : <img src={dropDownSvg} alt="" />}
        <span>{pullUpLoadText}</span>
      </>
    ) : footerStatus === STATUS.loading ? (
      <>
        {loadingIcon ? loadingIcon : <img src={loadingSvg} alt="" className="icon-loading" />}
        <span>{loadingText}</span>
      </>
    ) : null;
    return hasMore && loadMoreFn ? footerText : <p>{noMoreDataText}</p>;
  }

  touchStart = (e: any) => {
    if (!this.canRefresh()) {
      return;
    }
    PullRefresh.initialTouch = {
      clientY: e.touches[0].clientY,
      scrollTop: e.currentTarget.scrollTop
    }
  }

  touchMove = (e: any) => {
    if (!this.canRefresh()) {
      return;
    }
    const { distancePullDownRefresh = 60 } = this.props;
    const touchDistance = e.touches[0].clientY - PullRefresh.initialTouch.clientY;
    const { scrollTop } = e.currentTarget;
    // 下拉页面 && 到了页面顶部
    if (touchDistance > 0 && scrollTop <= 0) {
      // 页面内容下拉的距离。因为 touchStart 的时候可能存在 scrollTop，所以需要减去初始的 scrollTop
      let pullDistance = touchDistance - PullRefresh.initialTouch.scrollTop;
      // easing 函数时计算出适当的下拉距离，防止下拉距离过大
      const pullHeight = this.easing(pullDistance);
      this.setState({
        pullHeight,
        headerStatus: pullHeight > distancePullDownRefresh ? STATUS.loosenRefresh : STATUS.pullDownRefresh,
      })
    }
  }

  touchEnd = () => {
    if (!this.canRefresh()) {
      return;
    }
    const { headerStatus } = this.state;
    const { refreshFn } = this.props;
    if (headerStatus === STATUS.loosenRefresh) {
      this.setState({
        headerStatus: STATUS.refreshing,
        pullHeight: 0
      })
      if (refreshFn) {
        refreshFn(() => {
          this.setState({
            // 刷新完成后将 header 置为刷新完成的状态
            headerStatus: STATUS.refreshed,
          }, () => {
            // 500ms 后隐藏掉刷新完成的文案
            setTimeout(() => {
              this.setState({
                headerStatus: STATUS.init,
              })
            }, 500);
          })
        });
        
      }
    } else {
      this.setState({
        headerStatus: STATUS.init,
        pullHeight: 0
      })
    }
  }

  // 如果没有传递刷新函数，或者 header 正在刷新、footer 正在加载，则视为当前不能刷新
  canRefresh = () => {
    const { refreshFn } = this.props;
    const { headerStatus } = this.state;
    return refreshFn && !([STATUS.refreshing, STATUS.loading].includes(headerStatus));
  }

  easing(distance: number) {
    const availHeight = window.screen.availHeight;
    return (availHeight / 2.5) * Math.sin(distance / availHeight * (Math.PI / 2));
  }

  scroll = (e: any) => {
    const ref = e.currentTarget as HTMLDivElement;
    const { hasMore, loadMoreFn, distancePullUpLoad = 0 } = this.props;
    const { footerStatus } = this.state;
    if (
      ref &&
      hasMore &&
      loadMoreFn &&
      footerStatus !== STATUS.loading &&  // 已经在 loading 状态就不再触发，避免在 loading 时还下拉页面导致多次触发
      ref.scrollHeight - distancePullUpLoad <= ref.scrollTop + ref.clientHeight
    ) {
      this.setState({
        footerStatus: STATUS.loading
      });
      loadMoreFn(() => {
        // 加载数据完成后改变 footer 状态
        this.setState({
          footerStatus: STATUS.pullUpLoad
        })
      });
    }
  }

  render() {
    const { pullHeight, headerStatus, footerStatus } = this.state;
    const { hasMore, className = '' } = this.props;
    const style = pullHeight ? {
      transform: `translateY(${pullHeight}px)`
    } : undefined;

    return (
      <div
        className={`dangosky-pull-refresh-container status-${headerStatus} ${className}`}
        onScroll={this.scroll}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
      >
        <div className="dangosky-header">
          {this.renderHeader()}
        </div>
        <div className="dangosky-body" style={style}>
          {this.props.children}
        </div>
        <div className={`dangosky-footer footer-status-${!hasMore ? 'no-more-data' : footerStatus}`}>
          {this.renderFooter()}
        </div>
      </div>
    )
  }
}

export default PullRefresh;
