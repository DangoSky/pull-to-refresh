import React, { PureComponent, ReactNode } from 'react';
import './style.less';

interface PullToRefreshProps {
  children: ReactNode,
  classname?: string,
  refreshCallback?: Function,
  hasMore?: boolean
}

class PullToRefresh extends PureComponent<PullToRefreshProps> {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default PullToRefresh;
