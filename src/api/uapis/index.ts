/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/utils/axios';
/**
 * 热榜类型
 *
 * weread（微信读书热门书籍）, weatheralarm（天气预警信息）, earthquake（地震速报）, history（历史上的今天）
 * netease-music（网易云音乐热歌榜）, qq-music（QQ音乐热歌榜）
 * lol（英雄联盟热帖）, genshin（原神热榜）, honkai（崩坏3热榜）, starrail（星穹铁道热榜）
 * sspai（少数派热榜）, ithome（IT之家热榜）, ithome-xijiayi（IT之家·喜加一栏目）, juejin（掘金社区热榜）, jianshu（简书热榜）, guokr（果壳热榜）, 36kr（36氪热榜）, 51cto（51CTO热榜）, csdn（CSDN博客热榜）, nodeseek（NodeSeek 技术社区）, hellogithub（HelloGitHub 项目推荐）
 * baidu（百度热搜）, thepaper（澎湃新闻热榜）, toutiao（今日头条热榜）, qq-news（腾讯新闻热榜）, sina（新浪热搜）, sina-news（新浪新闻热榜）, netease-news（网易新闻热榜）, huxiu（虎嗅网热榜）, ifanr（爱范儿热榜）
 * bilibili（哔哩哔哩弹幕网）, acfun（A站弹幕视频网站）, weibo（新浪微博热搜）, zhihu（知乎热榜）, zhihu-daily（知乎日报热榜）, douyin（抖音热榜）, kuaishou（快手热榜）, douban-movie（豆瓣电影榜单）, douban-group（豆瓣小组话题）, tieba（百度贴吧热帖）, hupu（虎扑热帖）, ngabbs（NGA游戏论坛热帖）, v2ex（V2EX技术社区热帖）, 52pojie（吾爱破解热帖）, hostloc（全球主机交流论坛）, coolapk（酷安热榜）
 */
// 保持之前的类型导出
export type HotboardType =
  | 'weread' | 'weatheralarm' | 'earthquake' | 'history'
  | 'netease-music' | 'qq-music' | 'lol' | 'genshin' | 'honkai' | 'starrail'
  | 'bilibili' | 'acfun' | 'weibo' | 'zhihu' | 'zhihu-daily' | 'douyin'
  | 'kuaishou' | 'douban-movie' | 'douban-group' | 'tieba' | 'hupu'
  | 'ngabbs' | 'v2ex' | '52pojie' | 'hostloc' | 'coolapk'
  | 'baidu' | 'thepaper' | 'toutiao' | 'qq-news' | 'sina' | 'sina-news'
  | 'netease-news' | 'huxiu' | 'ifanr' | 'sspai' | 'ithome' | 'ithome-xijiayi'
  | 'juejin' | 'jianshu' | 'guokr' | '36kr' | '51cto' | 'csdn' | 'nodeseek' | 'hellogithub';

/**
 * 查询热榜参数接口
 */
export interface HotboardParams {
  type: HotboardType;
  time?: number;
  keyword?: string;
  time_start?: number;
  time_end?: number;
  limit?: number;
  sources?: boolean;
}

/**
 * 热榜基础条目
 */
export interface HotboardItem {
  title: string;
  url: string;
  hot_value?: string | number;
  index?: number;
  extra?: Record<string, any>;
  cover?: string; // 仅音乐类等特定平台有效
}

/**
 * 核心响应结构：使用联合类型处理不同模式
 */
export type HotboardResponse = {
  type: HotboardType;
  update_time: string;
  snapshot_time?: number;
} & (
  | { list: HotboardItem[]; results?: never; sources?: never; count?: never; keyword?: never } // 普通/时光机模式
  | { results: HotboardItem[]; count: number; keyword: string; list?: never; sources?: never } // 搜索模式
  | { sources: string[]; list?: never; results?: never; count?: never; keyword?: never }      // 数据源列表模式
);

/**
 * 查询热榜
 * @param params 
 * @param params.type 热榜类型
 * @param params.time 毫秒时间戳，返回最接近该时间的热榜快照。不传则返回当前实时热榜
 * @param params.keyword 搜索关键词，在历史热榜中搜索包含该关键词的条目。需配合 time_start 和 time_end 使用。
 * @param params.time_start 搜索起始时间戳（毫秒）。
 * @param params.time_end 搜索结束时间戳（毫秒）。
 * @param params.limit 搜索模式下最大返回条数，默认 50，最大 200。
 * @param params.sources 设为 true 时列出所有可用的历史数据源，忽略其他参数。
 * @returns 返回 Promise，内部类型为 HotboardItem 数组
 */
const getHotboard = (params: HotboardParams) => {
  return request.get<HotboardResponse>({
    url: '/uapis/v1/misc/hotboard',
    params,
  });
};

export { getHotboard };
