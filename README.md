# 下拉刷新组件

## 提供的主要功能

1. 下拉刷新

2. 上拉加载更多


## 支持的 Props

| prop | 数据类型 | 说明 | 备注 |
| ---- | --- | ------- | --- |
| loadMoreFn |  (fn: () => void) => void |  上拉页面后加载更多的函数 | 可选
| refreshFn |  (fn: () => void) => void | 下拉页面后刷新数据的函数，不传的话表示不开启下拉刷新功能 | 可选
| className |  string | 外层类名 | 可选
| hasMore |  boolean | 是否还有更多数据 | 可选，默认是`true`
| noMoreDataText |  string | 没有更多数据的文案 | 可选，默认是`无更多数据`
| pullUpLoadText |  string | 上拉加载更多的文案 | 可选，默认是`上拉页面加载更多数据`
| loadingText |  string | 正在加载的文案 | 可选，默认是`正在加载`
| distancePullUpLoad |  number | 距离底部多大距离就开始加载更多数据 | 可选，默认是`0`
| pullDownRefreshText |  string | 下拉刷新的文案 | 可选，默认是`下拉刷新`
| loosenRefreshText |  string | 松开刷新的文案 | 可选，默认是`松开刷新`
| refreshingText |  string | 正在刷新的文案 | 可选，默认是`正在刷新`
| refreshedText |  string | 刷新完成的文案 | 可选，默认是`刷新完成`
| distancePullDownRefresh |  number | 下拉多大的距离后松开就开始刷新 | 可选，默认是`60px`
| loadingIcon |  ReactNode | 加载中的 icon | 可选
| completeIcon |  ReactNode | 加载完成的 icon | 可选
| pullUpIcon |  ReactNode | 上拉加载更多的 icon | 可选
| pullDownIcon |  ReactNode | 下拉刷新的 icon | 可选
| loosenIcon |  ReactNode | 松开刷新的 icon | 可选
