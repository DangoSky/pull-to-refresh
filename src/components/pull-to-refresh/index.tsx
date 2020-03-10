import React, { PureComponent, ReactNode } from 'react';
import './style.less';
import dropDownSvg from './images/drop-down.svg';
import loadingSvg from './images/loading.svg';

interface PullRefreshProps {
  children: ReactNode,
  classname?: string,
  initData: (fn: () => void) => void,
  loadFn?: (fn: () => void) => void,
  refreshFn?: (fn: () => void) => void,
  hasMore?: boolean,
  noMoreDataText?: string,
  pullUpLoadHint?: string,    // 上拉加载更多提示语
  loadingIcon?: ReactNode,    // 加载中显示的 icon
  loadingText?: string,       // 正在加载的文案
  distancePullUpLoad?: number,  // 距离底部多大距离就开始加载更多数据
  pullToRefreshText?: string,     // 下拉刷新提示语
  loosenRefreshText?: string,      // 松开刷新的文案
  refreshingText?: string         // 正在刷新的文案
  refreshedText?: string          // 刷新完成的文案
  distancePullToRefresh?: number, // 下拉多大的距离后松开就刷新
}

const STATUS = {
  init: 'init',
  pullUpLoad: 'pull-up-load',
  loading: 'loading',
  pullToRefresh: 'pull-to-refresh',
  loosenRefresh: 'loosen-refresh',
  refreshing: 'refreshing',
  refreshed: 'refreshed'
}

class PullRefresh extends PureComponent<PullRefreshProps> {
  private divRef = React.createRef<HTMLDivElement>()
  static initialTouch = {
    clientY: 0,
    scrollTop: 0
  }

  state = {
    headerStatus: STATUS.init,
    footerStatus: STATUS.init,
    pullHeight: 0,
  }

  componentDidMount() {
    // 初始化数据后通过回调的形式来改变 footerStatus，避免文案会闪变
    this.props.initData(() => {
      this.setState({
        footerStatus: STATUS.pullUpLoad
      });
    })
    // const ref = this.divRef.current;
    // if (ref) {
    //   ref.addEventListener('touchmove', this.touchMove, {
    //     passive: false
    //   })
    // }
  }

  renderHeader = () => {
    const { headerStatus } = this.state;
    const {
      pullToRefreshText = '上拉刷新',
      loosenRefreshText = '松开刷新',
      refreshingText = '正在刷新',
      refreshedText = '刷新完成'
    } = this.props;
    // TODO: icon
    const pullRefresh = (
      <>
        <span>{pullToRefreshText}</span>
      </>
    );
    const loosenRefresh = (
      <>
        <span>{loosenRefreshText}</span>
      </>
    )
    const refreshing = (
      <>
        <span>{refreshingText}</span>
      </>
    );
    const refreshed = (
      <>
        <span>{refreshedText}</span>
      </>
    )
    switch(headerStatus) {
      case STATUS.pullToRefresh: return pullRefresh;
      case STATUS.loosenRefresh: return loosenRefresh;
      case STATUS.refreshing: return refreshing;
      case STATUS.refreshed: return refreshed;
      default: return null;
    }
  }

  renderFooter = () => {
    const {
      hasMore,
      noMoreDataText = '无更多数据',
      pullUpLoadHint = '下拉页面加载更多数据',
      loadingText = '正在加载'
    } = this.props;
    const { footerStatus } = this.state;
    const footerText = footerStatus === STATUS.pullUpLoad ? (
      <>
        <img src={dropDownSvg} alt=""/>
        <span>{pullUpLoadHint}</span>
      </>
    ) : footerStatus === STATUS.loading ? (
      <>
        <img src={loadingSvg} alt="" className="icon-loading" />
        <span>{loadingText}</span>
      </>
    ) : null;
    return hasMore ? footerText : <p>{noMoreDataText}</p>;
  }

  touchStart = (e: any) => {
    if (!this.canRefresh()) {
      return;
    }
    const ref = e.currentTarget;
    PullRefresh.initialTouch = {
      clientY: e.touches[0].clientY,
      scrollTop: ref.scrollTop
    }
  }

  touchMove = (e: any) => {
    if (!this.canRefresh()) {
      return;
    }
    const { distancePullToRefresh = 60 } = this.props;
    const touchDistance = e.touches[0].clientY - PullRefresh.initialTouch.clientY;
    const { scrollTop } = e.currentTarget;
    // if(!this.divRef.current) return;
    // const { scrollTop } = this.divRef.current;
    // console.log(PullRefresh.initialTouch);
    // console.log(scrollTop, touchDistance);
    // 下拉页面 && 到了页面顶部
    if (touchDistance > 0 && scrollTop <= 0) {
      // 应该下拉的距离
      let pullDistance = touchDistance - PullRefresh.initialTouch.scrollTop;
      if (pullDistance < 0) {
        pullDistance = 0;
        PullRefresh.initialTouch.scrollTop = touchDistance;   // ?
      }
      const pullHeight = this.easing(pullDistance);
      console.log(pullHeight);
      this.setState({
        pullHeight,
        headerStatus: pullHeight > distancePullToRefresh ? STATUS.loosenRefresh : STATUS.pullToRefresh,
      })
    }
  }

  touchEnd = (e: any) => {
    if (!this.canRefresh()) {
      return;
    }
    const { headerStatus } = this.state;
    const { refreshFn } = this.props;
    if (headerStatus === STATUS.loosenRefresh) {
      this.setState({
        headerStatus: STATUS.refreshing,
        // pullHeight: 0
      })
      if (refreshFn) {
        refreshFn(() => {
          this.setState({
            headerStatus: STATUS.refreshed,
            pullHeight: 0
          }, () => {
            setTimeout(() => {
              this.setState({
                headerStatus: STATUS.init,
              })
            }, 1000);
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

  canRefresh = () => {
    const { refreshFn } = this.props;
    const { headerStatus } = this.state;
    return refreshFn && !([STATUS.refreshing, STATUS.loading].includes(headerStatus));
  }

  easing(distance: any) {
    // t: current time,
    // b: begInnIng value, 
    // c: change In value, 
    // d: duration
    const t = distance;
    const b = 0;
    const d = window.screen.availHeight; // 允许拖拽的最大距离
    const c = d / 2.5; // 提示标签最大有效拖拽距离
  
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  scroll = (e: any) => {
    // scroll = (e: WheelEvent) => {
    // TODO：可以不使用 ref 而使用 e.currentTarget？
    // const ref = this.divRef.current;
    const ref = e.currentTarget as HTMLDivElement;
    const { hasMore, loadFn, distancePullUpLoad = 0 } = this.props;
    const { footerStatus } = this.state;
    if (
      ref &&
      hasMore &&
      loadFn &&
      footerStatus !== STATUS.loading &&  // 已经在 loading 状态就不再触发，避免在 loading 时还下拉页面导致多次触发
      ref.scrollHeight - distancePullUpLoad <= ref.scrollTop + ref.clientHeight
    ) {
      this.setState({
        footerStatus: STATUS.loading
      })
      loadFn(() => {
        // 加载数据完成后改变 footer 状态
        this.setState({
          footerStatus: STATUS.pullUpLoad
        })
      });
    }
  }

  animationEnd = () => {
    console.log('animationEnd');
    this.setState({
      headerStatus: STATUS.init
    })
  }

  render() {
    const { pullHeight, headerStatus } = this.state;
    const style = pullHeight ? {
      // transform: `translateY(${pullHeight}px)`
      WebkitTransform: `translate3d(0,${pullHeight}px,0)`,
    } : undefined;

    return (
      <div
        className={`dangosky-pull-refresh-container status-${headerStatus}`}
        ref={this.divRef}
        onScroll={this.scroll}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
        // onAnimationEnd={this.animationEnd}
      >
        <div className="dangosky-header">
          {this.renderHeader()}
        </div>
        <div className="dangosky-body" style={style}>
          {this.props.children}
        </div>
        <div className="dangosky-footer">
          {this.renderFooter()}
        </div>
      </div>
    )
  }
}

export default PullRefresh;
