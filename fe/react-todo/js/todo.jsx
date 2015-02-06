// 信息通知系统
var LightTodo = new Light('Todo');

// @client: 生成唯一 id
var uuid = (function() {
  var prefix = +new Date;
  var id = 0;
  return function() {
    return prefix + (++id) + '';
  };
})();

// 支持动画.
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

var Todo = React.createClass({
  getInitialState: function() {
    return {
      key: '_todo_'
    };
  },
  save: function(value) {
    var list = storage.get(this.state.key) || [];
    var item = {
      time: +new Date,
      value: value,
      state: false,
      uuid: uuid()
    };
    list.push(item);
    storage.set(this.state.key, list);
    setTimeout(this.change, 1000);
  },
  remove: function(id) {
    var list = storage.get(this.state.key) || [];
    for (var i = 0, l = list.length; i < l; ++i) {
      var item = list[i];
      if (item.uuid === id) {
        list.splice(i, 1);
        break;
      }
    }
    storage.set(this.state.key, list);
    this.change();
  },
  update: function(id) {
    var list = storage.get(this.state.key) || [];
    for (var i = 0, l = list.length; i < l; ++i) {
      var item = list[i];
      if (item.uuid === id) {
        item.state = !item.state;
        break;
      }
    }
    storage.set(this.state.key, list);
    this.change();
  },
  get: function(cb) {
    var list = storage.get(this.state.key) || [];
    cb(list);
  },
  change: function() {
    LightTodo.notify('refresh');
  },
  render: function() {
    return <div>
      <TodoForm save={this.save} />
      <TodoList get={this.get} remove={this.remove} update={this.update} />
    </div>
  }
});

var TodoForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      value: '', 
      length: 140,
      loading: false
    };
  },
  componentDidMount: function() {
    LightTodo.listen('refresh', this.loading);
  },
  loading: function() {
    if (this.state.loading) {
      this.setState({
        value: '',
        loading: false
      });
    }
  },
  handle: function(e) {
    // 可根据 this.state.loading 状态做些事情
    var dom = this.refs.todo.getDOMNode();
    var value = dom.value.trim();
    if (value && value.length <= this.state.length) {
      this.props.save(value);
      this.setState({
        loading: true
      });
    }
  },
  openEditer: function() {
    if (this.state.loading) {
      this.setState({
        loading: false
      });
    }
  },
  render: function() {
    var cx = React.addons.classSet;
    var classSet = cx({
      'form': 1,
      'unvalidate': this.state.value.length > 140
    });
    return (
      <div className={classSet} data-length={this.state.length - this.state.value.length}>
        <textarea
          disabled={this.state.loading}
          onDoubleClick={this.openEditer}
          valueLink={this.linkState('value')}
          placeholder="Todo != 高效率"
          ref="todo"
        />
        <input className="addTodo" type="submit" onClick={this.handle} />
      </div>
    );
  }
});

var TodoItem = React.createClass({
  getInitialState: function() {
    return {};
  },
  handle: function(e) {
    var target = e.target;
    var action = target.getAttribute('data-action');
    var root = this.refs.item.getDOMNode();
    var uuid = root.getAttribute('data-uuid');
    if (!uuid)return;
    switch(action) {
      case 'remove':
        this.props.remove(uuid);
        break;
      case 'update':
        this.props.update(uuid);
        break;
      default: break;
    }
  },
  render: function() {
    var cx = React.addons.classSet;
    var classSet = cx({
      'undo': !this.props.item.state,
      'did': this.props.item.state,
      'content': 1
    });
    /*
      * jsx 中, 注释无效
      * 在 jsx 中使用 {User_Data}, 在生成 HTML 时, 会把特殊字符进行转义.
      * 在编码时, 开发人员写的实体/十进制/十六进制会保留原字符.
      * 确定需要支持 HTML 代码时, 使用  dangerouslySetInnerHTML={{__html: User_Data}} 输出.
    */
    return <li className="todoitem" data-uuid={this.props.item.uuid} onClick={this.handle} ref="item">
      <span className={classSet}>{this.props.item.value}</span>
      <a className="delete" data-action="remove">删除</a>
      <a className="update" data-action="update">标记</a>
    </li>
  }
});

var TodoList = React.createClass({
  getInitialState: function() {
    return {
      list: []
    };
  },
  componentWillMount: function() {
    this.refresh();
  },
  componentDidMount: function() {
    LightTodo.listen('refresh', this.refresh);
  },
  refresh: function() {
    this.props.get(function(list) {
      this.setState({
        list: list.reverse()
      });
    }.bind(this));
  },
  /*
    key 属性: 用来 diff DOM 结构.
  */
  render: function() {
    var self = this;
    var todoItems = this.state.list.map(function(item, index) {
      return <TodoItem {...self.props} item={item} key={item.uuid} />;
    });
    return <ul>
      <ReactCSSTransitionGroup transitionName="example">
        {todoItems}
      </ReactCSSTransitionGroup>
    </ul>;
  }
});

React.render(
  <Todo />,
  document.getElementById('box')
);
