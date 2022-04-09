# Webpack

## 事件流

webpack类似一个生产线
1. 经过一系列的处理流程后才能将源文件转化成输出结果
2. 只有当前的处理完成后才能提交到下一个流程处理
3. 插件类似插入生产线的某个功能，特定时机对线上资源进行处理

## 核心概念

### Entry

入口， Webpack执行构建的第一步

### Moudle

一个模块对应一个文件，会从配置的Entry开始递归找出所有的依赖的模块

### Chunk

代码块，Chunk由多个模块组合而成，用于代码的合并和分割

### Loader

模块转换器，将模块原有内容按照需求转换成新内容

### Plugin

扩展插件，webpack构建流程中特定时机注入扩展逻辑，改变输出结果

### Output

输出结果，处理后得出的最终结果

## 相关类

### Tapable

Webpack通过Tapable组织生产线
1. 插件只需要监听它所关心的事件，就能加入到生产线中
2. 保持了插件的有序性

### Complier

Complier负责整个的构建流程（准备、编译、输出等）
1. 文件监听
2. 启动编译

### Compliation

1. Compliation只负责其中的 编译 过程
2. Compliation只代表一次编译，也就是说，每当文件有变动，就重新生成一个Compliation实例，即一个文件结构
3. 一个Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等

## bundle，chunk，module是什么

## 运行流程

![webpack打包流程](assets/01-webpack打包流程.png)

1. 对于一份同逻辑的代码，当我们手写下一个一个的文件，每个文件就是module
2. module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 chunk 文件
3. webpack 处理好 chunk 文件后，最后会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终源文件

### 初始化参数

从配置文件和shell中读取和合并参数，并得出最终参数

### 开始编译

使用上一步的参数初始化Compiler对象，加载所有的配置插件，执行对象run方法开始编译

会执行以下步骤
1. 实例化Compiler对象，并且全局唯一，包含完整的webpack配置
2. 加载插件，调用插件的apply方法，使插件可以监听后续的事件节点
3. 应用node的文件系统至compiler对象，方便文件的寻找和读取
4. 确定入口，读取配置的Entrys

### 编译模块

入口出发，对所有配置的Loader对模块进行编译，再找出该模块的依赖的模块

1. 获取文件路径entry
2. 通过entry读取模块内容entryContent
3. 调用babelLoader获取entryContent转化结果entrySource
4. 生成entryModule对象，并设置模块的id和source，然后推入modules中

### 完成模块编译

1. 使用loader翻译完所有的模块后，得到每一个模块被翻译后的最终内容和他们的依赖关系
2. 根据入口和模块的依赖关系组成一个chunk
3. 把每个Chunk转化成一个单独的文件加入到输出列表中

这里是修改输出内容的最后机会

### 输出完成

确定好输出内容后，确定输出的路径和文件名，把文件内容写入到文件系统中
