/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 初始化Vue.optinos对象 并给其扩展
  // ASSET_TYPES 数组 [component,directives,filters]
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
      Vue.options[type + 's'] = Object.create(null)
    })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // extend(to,from) 意思为把from里的内容拷贝到to里 这里设置了一个keep-alive组件
  extend(Vue.options.components, builtInComponents)

  // 注册Vue.use() 用来注册插件
  initUse(Vue)
  // 注册Vue.mixin() 实现代码混入
  initMixin(Vue)
  // 注册Vue.extend() 基于传入的options返回一个组件的构造函数
  initExtend(Vue)
  // 注册Vue.directive() Vue.component() Vue.filter()
  initAssetRegisters(Vue)
}
